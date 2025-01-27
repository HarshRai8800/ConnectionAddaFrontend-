import { DynamicSidebar } from "@/components/ui/sidebar_component";
import { SocketProvider } from "@/context/SocketContext";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {




  return (
    <SocketProvider>
        <div className="flex w-full h-screen overflow-hidden">
  <DynamicSidebar  />
  <div className=" h-full overflow-auto">{children}</div>
</div>
        </SocketProvider>
     
        
        
     
      
     
  );
}