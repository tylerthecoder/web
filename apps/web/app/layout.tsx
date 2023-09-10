import NavBar from "./navbar"
import "./global.css"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head />
      <body className="flex flex-col bg-gray-900">
        <NavBar />
        <div className="flex-grow">
          {children}
        </div>
      </body>
    </html>
  )
}
