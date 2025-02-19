import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@mui/joy";

const UserForm = () => {
  const { control } = useForm();
  return (
    <div>
      <Controller
        name='name'
        control={control}
        render={({ field }) => <Input {...field} />}
      />
    </div>
  );
};

export default UserForm;