import { KeyboardEventHandler } from "react";

export interface IButtonProps {
    id?: string,
    className?: string,
    type?: "button" | "reset" | "submit",
    ref?: any
}

export interface IInputProps {
    id?: string,
    name: string,
    onChange: KeyboardEventHandler,
    className: String
}
export interface IObjectMap {
    [key: string | number]: any
}

export type TCallback = () => any;