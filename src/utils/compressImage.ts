export async function compressImage(
  file: File,
  //物理像素宽度
  maxWidth = 800,
  quality = 0.8,
): Promise<File> {
  // 检查现代浏览器是否支持所需的 API
  if (
    typeof Worker !== "undefined" &&
    typeof OffscreenCanvas !== "undefined" &&
    typeof createImageBitmap !== "undefined"
  ) {
    return new Promise((resolve, reject) => {
      // 把压缩逻辑写在字符串里，作为基于内联 Blob 的 Web Worker
      const workerCode = `
        self.onmessage = async function(e) {
          const { file, maxWidth, quality } = e.data;
          try {
            // 利用全新的 API：在后台线程将文件解码成位图
            const bitmap = await createImageBitmap(file);
            let width = bitmap.width;
            let height = bitmap.height;

            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }

            // 在后台线程创建离屏的 Canvas，不占主线程！
            const canvas = new OffscreenCanvas(width, height);
            const ctx = canvas.getContext("2d");
            ctx.drawImage(bitmap, 0, 0, width, height);

            // 转换回压缩后的 WebP 二进制数据
            const blob = await canvas.convertToBlob({
              type: "image/webp",
              quality: quality
            });

            // 成功后，将结果派发给主线程
            self.postMessage({ success: true, blob });
            
            // 手动释放位图内存防爆栈
            bitmap.close();
          } catch (error) {
            self.postMessage({ success: false, error: error.message || String(error) });
          }
        };
      `;

      // 根据源码创建 Blob URL 以便 Worker 加载
      const blobURL = URL.createObjectURL(
        new Blob([workerCode], { type: "application/javascript" }),
      );
      const worker = new Worker(blobURL);

      worker.onmessage = (e) => {
        const { success, blob, error } = e.data;
        // 回收系统资源
        worker.terminate();
        URL.revokeObjectURL(blobURL);

        if (success && blob) {
          // 在外层（主线程）组装成 File 对象
          const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
          const newFile = new File([blob], fileName, {
            type: "image/webp",
            lastModified: Date.now(),
          });
          resolve(newFile);
        } else {
          reject(new Error("Web Worker compression failed: " + error));
        }
      };

      worker.onerror = (error) => {
        worker.terminate();
        URL.revokeObjectURL(blobURL);
        reject(error);
      };

      // 启动 Worker！把原文件直接扔过去
      worker.postMessage({ file, maxWidth, quality });
    });
  } else {
    // 降级方案：针对较老的浏览器，依旧保留主线程同步压缩的兜底逻辑
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                const newFile = new File([blob], fileName, {
                  type: "image/webp",
                  lastModified: Date.now(),
                });
                resolve(newFile);
              } else {
                reject(new Error("Image compression failed"));
              }
            },
            "image/webp",
            quality,
          );
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  }
}
