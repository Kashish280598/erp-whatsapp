export interface Integration {
    name: string;
    description: string;
    logo: string;
    riskCategory: string;
    isSupported: boolean;
    sub?: Integration[];
    id?: string;
};

export type FormOption = {
  option: string;
};

export type FormFieldType = "textBox" | "textArea" | "checkBox" | "toggle" | "radio" | "dropdown";

export type FormField = {
  type: FormFieldType;
  label: string;
  name: string;
  required: boolean;
  comment_required: boolean;
  image_required: boolean;
  action_required: boolean;
  is_new_row: boolean;
  min_length: number;
  max_length: number;
  placeholder?: string;
  default_value?: string;
  notes?: string;
  grid: number;
  is_options_available: boolean;
  is_placeholder_required: boolean;
  is_single_option: boolean;
  options: FormOption[];
  uuid: string;
};

export type FormDataPayload = {
  form_data: FormField[];
};
