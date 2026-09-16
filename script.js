const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();

  const progress = $("#progress"), nav = $("#nav");
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
    nav.classList.toggle("scrolled", scrollY > 20);
  };
  addEventListener("scroll", updateScroll, {passive:true}); updateScroll();

  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if(e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
  }), {threshold:.12});
  $$(".reveal").forEach(el => io.observe(el));

  const palette = $("#palette"), input = $("#commandInput");
  const openPalette = () => { palette.classList.add("open"); palette.setAttribute("aria-hidden","false"); setTimeout(()=>input.focus(),50); };
  const closePalette = () => { palette.classList.remove("open"); palette.setAttribute("aria-hidden","true"); input.value=""; filterCommands(""); };
  const filterCommands = q => $$(".commands button").forEach(b => b.style.display = b.textContent.toLowerCase().includes(q.toLowerCase()) ? "flex" : "none");
  $("#themeBtn").addEventListener("click",()=>document.body.classList.toggle("light"));
  document.addEventListener("keydown",e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openPalette();}
    if(e.key==="Escape"){closePalette();$("#certModal").classList.remove("open");}
  });
  input.addEventListener("input",e=>filterCommands(e.target.value));
  palette.addEventListener("click",e=>{if(e.target===palette)closePalette();});
  $$(".commands button").forEach(b=>b.addEventListener("click",()=>{document.querySelector(b.dataset.go)?.scrollIntoView({behavior:"smooth"});closePalette();}));

  const menuBtn=$("#menuBtn"), desktopNav=$("#desktopNav");
  menuBtn.addEventListener("click",()=>{
    desktopNav.classList.toggle("mobile-open");
    if(desktopNav.classList.contains("mobile-open")) {
      Object.assign(desktopNav.style,{display:"flex",position:"absolute",top:"76px",left:"18px",right:"18px",padding:"15px",flexDirection:"column",background:"var(--panel)",border:"1px solid var(--line)",borderRadius:"12px"});
    } else desktopNav.removeAttribute("style");
  });

  const modal=$("#certModal"), img=$("#certImage");
  $$(".cert[data-img]").forEach(c=>c.addEventListener("click",()=>{img.src=c.dataset.img;modal.classList.add("open");modal.setAttribute("aria-hidden","false");}));
  $("#modalClose").addEventListener("click",()=>modal.classList.remove("open"));
  modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("open");});
});
