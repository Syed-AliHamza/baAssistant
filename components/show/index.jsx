 

const Show = ({ IF: condition, children }) => {
  if (condition) {
    return children;
  }

  return <></>;
};

export default Show;
