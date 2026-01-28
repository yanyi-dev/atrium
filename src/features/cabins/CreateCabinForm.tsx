import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Input from "../../ui/Input";
import FormRow from "../../ui/FormRow";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import { Cabin, CreateFormData } from "../../types";

import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";

interface CreateCabinFormProps {
  cabinToEdit?: Partial<Cabin>;
  //由Modal.Window传递
  onCloseModal?: () => void;
}

//两种数据获取方式
//一种是通过编辑更新的时候直接传,作为默认值
//另一种是表单提交成功时生成的数据对象，是一个新的Cabin
function CreateCabinForm({
  cabinToEdit = {},
  onCloseModal,
}: CreateCabinFormProps) {
  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);

  //表单会使用editValues来填充表单，如果有
  //填充表单的时候是根据之前register中的key值进行填充
  //赋值给defaultValue属性
  //defaultValues 默认只在 useForm 钩子第一次运行时读取数据
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<CreateFormData>({
    defaultValues: isEditSession ? (editValues as CreateFormData) : {},
  });

  const { isCreating, createCabin } = useCreateCabin();
  const { isEditing, editCabin } = useEditCabin();

  const isWorking = isCreating || isEditing;

  function onSubmit(data: CreateFormData) {
    //data.image是一个类数组对象，即FileList对象
    // mutate({ ...data, image: data.image[0] });

    const image = typeof data.image === "string" ? data.image : data.image[0];
    if (isEditSession)
      editCabin(
        { newCabinData: { ...data, image }, id: editId! },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
          onError: (err) => {
            toast.error((err as Error).message);
          },
        },
      );
    else
      createCabin(
        { ...data, image: image },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
          onError: (err) => {
            toast.error((err as Error).message);
          },
        },
      );
  }

  return (
    //handleSubmit中校验通过，它就会把表单里所有字段的值打包成一个对象，并作为第一个参数传递给onSubmit
    <Form
      onSubmit={handleSubmit(onSubmit)}
      $type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", { required: "This fild is required" })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register("maxCapacity", {
            required: "This fild is required",
            min: { value: 1, message: "Capacity should be at least 1" },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register("regularPrice", {
            required: "This fild is required",
            min: { value: 1, message: "Price should be at least 1" },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isWorking}
          defaultValue={0}
          {...register("discount", {
            required: "This fild is required",
            min: { value: 0, message: "Discount should be at least 0" },
            validate: (value) =>
              +value! <= +getValues().regularPrice! ||
              "The discount should be less than the regularPrice",
          })}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors?.description?.message}
      >
        <Textarea
          id="description"
          disabled={isWorking}
          defaultValue=""
          {...register("description", { required: "This fild is required" })}
        />
      </FormRow>

      <FormRow label="Cabin photo">
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            required: isEditSession ? false : "This fild is required",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          $variation="secondary"
          type="reset"
          // onClick={() => onCloseModal?.()}
          //上面写法最安全
          //直接写也没事，为undefined的话，React 仅仅会认为“这个按钮没有绑定任何点击事件”
          onClick={onCloseModal}
        >
          Cancel
        </Button>

        {/* 创建和编辑成功后的模态窗口关闭由表单成功提交时的onSuccess成功回调中完成 */}
        <Button disabled={isWorking}>
          {isEditSession ? "Edit cabin" : "Create new cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
