import { makeStyles } from "@material-ui/core/styles";

export default makeStyles(() => ({
  showHideToggleContainer: {
    height: 17,
    width: 17,
    "& > label": {
      cursor: "pointer",
    },
  },
  showHideToggleInput: {
    display: "none",
  },
}));
