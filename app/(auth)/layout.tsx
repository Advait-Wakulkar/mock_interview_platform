 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html className="dark">
      <body>
        {children}
      </body>
    </html>
  )
}