import Navbar from '../Navbar'

export default function NavbarExample() {
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Navbar />
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Desktop: Nav items on right. Mobile: Nav items at bottom.</p>
      </div>
    </div>
  )
}
