import toast from "react-hot-toast";
export const notifySuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    duration: 3000
  });
};

export const notifyError = (message) => {
  toast.error(message, {
    position: "top-right",
    duration: 4000
  });
};

export const notifyInfo = (message) => {
  toast((t) => (
    <span>ℹ️ {message}</span>
  ),
  {
    position: "top-right",
    duration: 3000
  });
};
