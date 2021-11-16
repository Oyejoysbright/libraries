import { AxiosError } from "axios";
import { CSSProperties, DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import { IFormMultipleControl } from "../../form/FormMultipleField";
import { IObjectMap } from "../../Interfaces";
import { TResponseType } from "../net";
import { TTableURL } from "../table";
import { IPickerProps } from "./picker";

export type TFormType = "inputs" | "radio" | "checkbox" | "picker" | "selector" | "switch" | "file" | "node" | "multiple-field";
export type TInputType = "text" | "textarea" | "email" | "number" | "password" | "date" | "time";
export type TValidation = "text" | "password" | "email" | "date" | "money";

type TStateValidation = {
    isRequired: boolean;
    isValid: boolean;
}
export type TFormStateValidator = Record<string, TStateValidation>;

export type TFormValidationHookStatus = {
    validateStats: boolean[];
    requiredControls: string[];
}

export type TFormSubmitStatus = {
    isValid: boolean;
    inValidControlNames: string[];
}

export type TFormStateChange = Record<string, any>;

export interface IFormProps {
    required?: boolean;
    readOnly?: boolean;
    label?: ReactNode;
    bottomLabel?: ReactNode;
    placeholder?: string;
}

type TOption = {
    label: string;
    value: string;
}

export interface IFormSelect extends DetailedHTMLProps<HTMLAttributes<HTMLSelectElement>, HTMLSelectElement>, IFormProps {
    options: TOption[];
}
export interface IFormInput extends DetailedHTMLProps<HTMLAttributes<HTMLInputElement>, HTMLInputElement>, IFormProps {
    type: TInputType;
    regex?: RegExp;
    validationRule?: TValidation;
}

export interface IFormSchema<T = unknown> {
    name: string;
    type: TFormType;
    control: IFormInput | IPickerProps<T> | ReactNode | IFormMultipleControl<T>;
}

export type IFormSchemas<T = unknown> = Array<IFormSchema<T> | IFormSchema<T>[]>;

export type IFormResponse<T> = {
    onSuccess(data: T): void;
    onFailed(): void;
}

export type TFormFetch<T> = {
    /**
     * This can either be json, text, arraybuffer, stream or blob.
     */
    responseType?: TResponseType; 
    /**
     * The base url and the post endpoint.
     */
    url: Pick<TTableURL, "baseUrl" | "create">;
    /**
     * A function called with server response as a param.
     * @param data T - the expected data. 
     */
    onSuccess(data: T): void;
    /**
     * It invokes when an error has occurred.
     */
    onFailure?(error: AxiosError):void;
    /**
     * The headers to be sent alongside the request.
     */
    headers?: Record<string, string>;
}
export interface IFormProp<T = unknown> {
    /**
     * The form structure.
     */
    schema: IFormSchemas;
    /**
     * The onchange event is mapped to all the form inputs and it is called on the active control.
     * @param name string
     * @param value string
     */
    onChange?(name: string, value: string): void;
    /**
     * It inverts the validation status of the component.
     * This could be used in disabling the form button. 
     */
    invertValidation?: boolean;
    /**
     * This disables the form fields and button.
     */
    disabled?: boolean;
    /**
     * The label to be displayed on the form.
     */
    actionLabel?: string;
    /**
     * The style to be applied to the button.
     */
    actionStyle?: CSSProperties;
    /**
     * The style to be used for the controls wrapper. 
     */
    controlWrapperStyle?: CSSProperties;
    /**
     * It hides the form button.
     */
    noButton?: boolean;
    /**
     * It calls a function with the boolean status of the form fields. 
     * It does this with the required and regex props on each control.
     * @param isValid boolean
     * @param formInputsStatus TFormStateValidator
     */
    onValidate?(isValid: boolean, formInputsStatus?: TFormStateValidator): void;
    /**
     * It is called when the file control list changes.
     * @param name string
     * @param value FileList
     */
    onFileChange?(name: string, value: FileList): void;
    /**
     * It calls a function with the form validity state and the fields that are required as the first param and 
     * the form field state as the second param.
     * @param formStatus TFormSubmitStatus
     * @param data TFormStateChange
     */
    onSubmit?(formStatus: TFormSubmitStatus, data: TFormStateChange): Boolean;
    /**
     * It returns the form controls state object.
     * @param state TFormStateChange
     */
    onFormStateChanged?(state: TFormStateChange): void;
    /**
     * It is a wrapper that helps send form data to a specified end point.
     */
    post?: TFormFetch<T>;
}


export interface IFormRef {
    onSubmit(): void;
}