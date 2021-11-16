import { TInputType } from "../interfaces/forms";

export const Regex: Record<TInputType, RegExp> = {
    email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
    number: /[0-9]+/,
    text: /[A-Za-z]+/,
    date: /^0([1-9])/,
    time: /[0-9]:/,
    password: /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/,
    textarea: / /
  }