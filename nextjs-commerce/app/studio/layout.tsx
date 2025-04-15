export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ 
      height: '100vh', 
      width: '100%',
      overflow: 'auto',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column' 
    }}>
      {children}
    </div>
  );
} 