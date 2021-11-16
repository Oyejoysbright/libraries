import React from "react";
import { MdFileUpload } from "react-icons/md";
import InputFileButton from "./InputFileButton";

export default {
    title: "Input File Button",
    component: <InputFileButton />
}

const temp = (args) => <InputFileButton {...args} />;
export const defaultStory = temp.bind({});
defaultStory.args = {
    src: <MdFileUpload />
}