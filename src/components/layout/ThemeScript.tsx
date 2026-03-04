// Inline script injected before React hydrates — prevents FOUC (flash of unstyled content)
export function ThemeScript() {
  const script = `
    (function() {
      try {
        var t = localStorage.getItem('cutout_theme');
        if (t === 'light') {
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
        } else {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        }
      } catch(e) {
        document.documentElement.classList.add('dark');
      }
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
