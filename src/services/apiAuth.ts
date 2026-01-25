import supabase, { supabaseUrl } from "./supabase";

interface SignUpParams {
  fullName: string;
  email: string;
  password: string;
}

interface LoginParams {
  email: string;
  password: string;
}

interface UpdateCurrentUserParams {
  password?: string;
  fullName?: string;
  avatar?: File;
}

export async function signup({ fullName, email, password }: SignUpParams) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: "",
      },
    },
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function login({ email, password }: LoginParams) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

//如果本地有登陆记录，则直接查询登陆令牌是否过期
//没有就快速登陆
export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  //如果本地没登陆过，直接再去login页面登陆一次
  if (!session.session) return null;

  //即使本地登陆过，也要查询是否过期
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);

  return data?.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function updateCurrentUser({
  password,
  fullName,
  avatar,
}: UpdateCurrentUserParams) {
  // 密码和用户名分开更新
  let updateData;
  if (password) updateData = { password };
  if (fullName) updateData = { data: { fullName } };

  const { data, error } = await supabase.auth.updateUser(updateData || {});

  if (error) throw new Error(error.message);
  if (!avatar) return data;

  const fileName = `avatar-${data.user.id}-${Math.random()}`;

  //先上传头像，再指定url
  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);
  if (storageError) throw new Error(storageError.message);

  const { data: updatedUser, error: updateError } =
    await supabase.auth.updateUser({
      data: {
        avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
      },
    });
  if (updateError) throw new Error(updateError.message);

  return updatedUser;
}
