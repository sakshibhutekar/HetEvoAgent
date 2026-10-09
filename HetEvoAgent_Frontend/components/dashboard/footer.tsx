import { Wind } from "lucide-react"

const links = ["About", "Documentation", "Privacy", "GitHub", "Contact"]

export function Footer() {
  return (
    <footer className="mt-2 border-t border-border pt-6">
      <div className="flex flex-col items-start justify-between gap-4 pb-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wind className="size-4" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">HetEvoAgent</p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} — AI Air Quality Management
            </p>
          </div>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {links.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
