import NavBar from "./navbar"
import "./global.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head />
      <body className="flex flex-col">
        <NavBar />
        <div className="flex-grow">
          {children}
        </div>
      </body>
    </html>
  )
}
