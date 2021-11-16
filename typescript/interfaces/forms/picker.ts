import { ChangeEvent, DetailedHTMLProps, OptionHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

export interface IPickerOptionProps<T> extends DetailedHTMLProps<OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement> {
    onSelected?(data: T): void;

}

export type TPickerSelectedOption<T = unknown> = {
    option: T | unknown;
    index: number;
    name: string;
}

export type TPickerRef = {
    selected: boolean;
}
export interface IPickerProps<T> extends DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
    /**
     * It replaces textual representation with component representation.
     * If control is to be rendered without edit access use the readOnly prop.
     */
    disabled?: boolean;
    /**
     * The options to be displayed in the picker tray when the control button is pushed.
     */
    options: Array<T>;
    /**
     * This should return the view for the picker tray.
     * @param option The item per entry.
     */
    onRenderOption(option: T): ReactNode;
    /**
     * The unique name for the field.
     */
    name?: string;
    /**
     * It calls a fucntion with  - {option, index, name}
     * @param event TPickerSelectedOption<T>
     */
    onSelected(event: TPickerSelectedOption<T>): void;
    /**
     * The total number of items that should be displayed per view.
     */
    optionCounts?: number; 
    /**
     * This is used to validate the entries in the input control.
     */
    regex?: RegExp;
    /**
     * It validates the control with the regex provided.
     */
    onValidate?: (isValid: boolean, e: ChangeEvent<HTMLInputElement>) => void;
    /**
     * The input change event handler. This is also called with an index of the selected item whenever the option item is selected.
     * @param event  ChangeEvent<HTMLInputElement>
     */
    onInputChange?(event: ChangeEvent<HTMLInputElement>):void;
    /**
     * It disables the input control.
     */
    readOnly?: boolean;
    /**
     * The key in an object whose value should be used as the selected option.
     */
    selectedValueKey?: string;
    /**
     * The key in T (object) to be used as value for the input control.
     */
    renderKey?: string;
    /**
     * It is like a monitor that stores users selection. 
     * It is controlled by change and mouse event of the select and option respectively.
     */
    label?: string;
}