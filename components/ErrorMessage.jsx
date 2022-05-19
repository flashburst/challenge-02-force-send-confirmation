function ErrorMessage({ children, style = {}, ...props }) {
  return (
    <div
      style={Object.assign(
        {
          display: 'flex',
          position: 'absolute',
          left: '0',
          top: '0',
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#eee',
          padding: '10px 20px',
          minWidth: '50vw',
          borderRadius: '5px',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Title({ children, style = {}, ...props }) {
  return (
    <h1 style={Object.assign({ margin: '5px 0 10px' }, style)} {...props}>
      {children}
    </h1>
  );
}

function Description({ children, style = {}, ...props }) {
  return (
    <div style={style} {...props}>
      {children}
    </div>
  );
}

function Body({ children, style = {}, ...props }) {
  return (
    <div
      {...props}
      style={Object.assign({ margin: '10px 0', flexGrow: 1 }, style)}
    >
      {' '}
      {children}
    </div>
  );
}

function Footer({ children, style = {}, ...props }) {
  return (
    <div
      {...props}
      style={Object.assign(
        {
          margin: '5px 0',
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'end',
          flexDirection: 'row',
          borderTop: '1px solid #333',
          paddingTop: '10px',
        },
        style
      )}
    >
      {children}
    </div>
  );
}

export default Object.assign(ErrorMessage, {
  Title,
  Description,
  Body,
  Footer,
});
