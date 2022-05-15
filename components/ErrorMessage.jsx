function ErrorMessage({ children, visible, style = {}, ...props }) {
  return (
    <div
      style={Object.assign(
        {
          display: visible ? 'flex' : 'none',
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          alignItems: 'center',
          justifyContent: 'center',
        },
        style
      )}
      {...props}
    >
      <div style={{ backgroundColor: 'white', padding: '10px 20px' }}>
        {children}
      </div>
    </div>
  );
}

function Title({ children, style, ...props }) {
  return (
    <h1 style={Object.assign({ margin: '5px 0' }, style)} {...props}>
      {children}
    </h1>
  );
}

function Body({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

function Footer({ children, ...props }) {
  return (
    <div {...props}>
      <hr />
      {children}
    </div>
  );
}

const EXECUTION_REVERTED = 'execution reverted: ';
export function bodyMessageFilter(message) {
  if (message.startsWith(EXECUTION_REVERTED)) {
    return message.slice(EXECUTION_REVERTED.length);
  }

  return message;
}

export default Object.assign(ErrorMessage, {
  Title,
  Body,
  Footer,
});
