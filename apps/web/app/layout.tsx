import NavBar from "./navbar";
import "./global.css";
import Script from "next/script";

const analyticsId = "G-B5KCWMNFJE";

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="flex flex-col bg-gray-900">
        <Script
          strategy="lazyOnload"
          id="google-anal"
          src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
        />

        <Script id="google-anal2" strategy="lazyOnload">
          {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${analyticsId}', {
                    page_path: window.location.pathname,
                    });
                `}
        </Script>

        <NavBar />
        <div className="flex-grow">{children}</div>
      </body>
    </html>
  );
}
