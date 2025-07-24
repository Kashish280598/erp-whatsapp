// src/hooks/useSanitizedForm.ts
import { useFormik, type FormikErrors } from "formik";
import DOMPurify from "dompurify";
import * as yup from "yup";

interface UseSanitizedFormOptions<T extends yup.AnyObject> {
  schema: yup.ObjectSchema<T>;
  initialValues: T;
  onSubmit: (data: T) => Promise<void>;
}

export function useSanitizedForm<T extends yup.AnyObject>({ schema, initialValues, onSubmit }: UseSanitizedFormOptions<T>) {
  const sanitizeValue = (value: any) => {
    if (typeof value === "string") {
      return DOMPurify.sanitize(value.trim());
    }
    return value;
  };

  const sanitizeForm = (formData: T): T => {
    const sanitized: Record<string, any> = {};
    for (const key in formData) {
      sanitized[key] = sanitizeValue((formData as any)[key]);
    }
    return sanitized as T;
  };

  const formik = useFormik<T>({
    initialValues,
    validationSchema: schema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, formikHelpers) => {
      const sanitized = sanitizeForm(values);
      try {
        await schema.validate(sanitized, { abortEarly: false });
        await onSubmit(sanitized);
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          const yupErrors: Record<string, string> = {};
          err.inner.forEach((validationError) => {
            if (validationError.path) {
              yupErrors[validationError.path] = validationError.message;
            }
          });
          formikHelpers.setErrors(yupErrors as FormikErrors<T>);
        }
      }
    },
  });

  return formik;
}
