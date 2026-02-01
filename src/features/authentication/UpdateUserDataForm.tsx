import { useState, FormEvent } from "react";

import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

import { useUser } from "./useUser";
import { useUpdateUser } from "./useUpdateUser";
import { compressImage } from "../../utils/compressImage";

function UpdateUserDataForm() {
  // We don't need the loading state, and can immediately use the user data, because we know that it has already been loaded at this point
  const { user } = useUser();

  //user数据不能直接解构，null类型的存在会报错
  const email = user?.email ?? "";
  const currentFullName = (user?.user_metadata?.fullName as string) ?? "";

  const { updateUser, isUpdating } = useUpdateUser();

  const [fullName, setFullName] = useState(currentFullName);
  const [avatar, setAvatar] = useState<File | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;

    if (!fullName) return;

    let uploadAvatar = avatar;

    if (avatar) {
      try {
        const compressedFile = await compressImage(avatar);
        uploadAvatar = compressedFile;
      } catch (err) {
        console.error(
          "Image compression failed, falling back to original image",
          err,
        );
      }
    }

    return updateUser(
      { fullName, avatar: uploadAvatar },
      {
        onSuccess: () => {
          setAvatar(null);
          formElement.reset();
        },
      },
    );
  }

  function handleCancel() {
    setFullName(currentFullName);
    setAvatar(null);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>

      <FormRow label="Full name">
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          id="fullName"
          disabled={isUpdating}
          required
        />
      </FormRow>

      <FormRow label="Avatar image">
        <FileInput
          id="avatar"
          accept="image/*"
          disabled={isUpdating}
          onChange={(e) => setAvatar(e.target.files?.[0] ?? null)}
        />
      </FormRow>

      <FormRow>
        <Button
          type="reset"
          $variation="secondary"
          disabled={isUpdating}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update account</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
