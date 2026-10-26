import { SOURCE_LIST } from "@gt/core";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border text-muted text-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 sm:px-6">
        <p>
          Data sources:{" "}
          {SOURCE_LIST.map((s, i) => (
            <span key={s.id}>
              {i > 0 && " · "}
              <a href={s.homepage} className="underline-offset-2 hover:underline" rel="noopener">
                {s.attribution}
              </a>
            </span>
          ))}
          . Prices may change at the store; always check before buying.
        </p>
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
