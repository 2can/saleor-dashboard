import useForm, { SubmitPromise, UseFormResult } from "@saleor/hooks/useForm";
import React from "react";

export interface FormProps<TData, TErrors> {
  children: (props: UseFormResult<TData>) => React.ReactNode;
  confirmLeave?: boolean;
  initial?: TData;
  resetOnSubmit?: boolean;
  onSubmit?: (data: TData) => SubmitPromise<TErrors[]> | void;
}

function Form<TData, TErrors>(props: FormProps<TData, TErrors>) {
  const {
    children,
    initial,
    resetOnSubmit,
    onSubmit,
    confirmLeave = false
  } = props;
  const renderProps = useForm(initial, onSubmit, { confirmLeave });

  function handleSubmit(event?: React.FormEvent<any>, cb?: () => void) {
    const { reset, submit } = renderProps;

    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    if (cb) {
      cb();
    }

    if (resetOnSubmit) {
      reset();
    }

    submit();
  }

  return <form onSubmit={handleSubmit}>{children(renderProps)}</form>;
}
Form.displayName = "Form";

export default Form;
