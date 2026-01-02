import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data: cabins, error } = await supabase.from("cabins").select("*");

  if (error) {
    throw new Error("Cabins could not be loaded!");
  }

  return cabins;
}

export async function createEditCabin(newCabin, id) {
  //如果是url开头，说明没改图像，如果不是，则为FileList对象，说明改了图像
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
  //replaceAll是一个安全措施。如果文件名里包含 /，Supabase 会误以为你要创建一个新文件夹。我们把 / 替换为空字符串，保证它只被当作文件名处理
  //Math.random()防止用户上传了两个都叫 cabin.jpg 的图片，导致后面覆盖前面的图片
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );

  //建立数据库与文件的连接，数据库不存文件，只存地址
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  //构键请求开始
  let query = supabase.from("cabins");

  //创建cabin
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  //编辑cabin
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);
  //构建请求结束

  //发送请求，并获得结果
  const { data, error } = await query.select().single();

  // const { data, error } = await supabase
  //   .from("cabins")
  //   .insert([{ ...newCabin, image: imagePath }])
  //不加 .select()：执行成功后，返回的 data 通常是空的
  // .select()
  //.single() 的作用：从“数组”变为“对象”
  // .single();
  if (error) {
    throw new Error("Cabins could not be created!");
  }

  //如果没有修改图片的话，直接返回
  if (hasImagePath) return data;

  //在创建小屋本身没有错误的情况下上传图片
  //程序加载图片的时候，从数据库中取出图片的url，在对图片进行访问
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  //如果图片上传失败，则应该删除对应创建的cabin
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not be created"
    );
  }
  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);
  // .eq("some_column", "someValue");
  if (error) {
    throw new Error("Cabins could not be deleted!");
  }

  return data;
}
