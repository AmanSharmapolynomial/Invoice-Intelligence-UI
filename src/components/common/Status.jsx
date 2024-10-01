const StatusTrue = () => (
    <svg
      // className="text-success"
      // class="bi bi-dot"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="green"
      // viewBox="0 0 16 16"
    >
      <circle fill="green" cx="8" cy="8" r="8" />
    </svg>
  );
  
  const StatusFalse = () => (
    <svg
      // className="text-danger"
      // class="bi bi-dot"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="green"
      // viewBox="0 0 16 16"
    >
      <circle fill="red" cx="8" cy="8" r="8" />
    </svg>
  );
  
  export const Status = ({ children }) =>
    children ? <StatusTrue /> : <StatusFalse />;
  