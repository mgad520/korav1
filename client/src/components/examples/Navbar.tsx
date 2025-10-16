import Navbar from '../Navbar'

export default function NavbarExample() {
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Navbar />
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Desktop: Hamburger menu on left. Mobile: Nav items at bottom.</p>
      </div>
    </div>
  )
}
