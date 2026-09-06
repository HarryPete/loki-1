"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heading,
  Image as ImageIcon,
  AlignLeft,
  Trash2,
  Plus,
  Images,
  Upload,
  Check,
  Pencil,
  LayoutTemplate,
  Bold,
  Italic,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ---------------------------------------------------------------------------
// Layouts
// ---------------------------------------------------------------------------

const LAYOUTS = [
  { id: "cover", name: "Cover", kind: "cover" },
  { id: "title-paragraph", name: "Title + Text", kind: "blocks", blockTypes: ["title", "paragraph"] },
  { id: "image-paragraph", name: "Image + Text", kind: "blocks", blockTypes: ["image", "paragraph"] },
  { id: "full-image", name: "Full Image", kind: "blocks", blockTypes: ["image"] },
  { id: "title-image-paragraph", name: "Title, Image + Text", kind: "blocks", blockTypes: ["title", "image", "paragraph"] },
  { id: "blank", name: "Blank", kind: "blocks", blockTypes: [] },
];

function defaultStyleFor(type) {
  if (type === "title") return { fontSize: 36, fontWeight: 700, fontStyle: "normal", color: "#111827" };
  if (type === "paragraph") return { fontSize: 18, fontWeight: 400, fontStyle: "normal", color: "#374151" };
  return null;
}

function makeBlock(type) {
  return {
    id: crypto.randomUUID(),
    type,
    style: defaultStyleFor(type),
    ...(type === "title" && { text: "" }),
    ...(type === "paragraph" && { text: "" }),
    ...(type === "image" && { src: "" }),
  };
}

function makePageFromLayout(layout) {
  if (layout.kind === "cover") {
    return { id: crypto.randomUUID(), layout: "cover", coverImage: "", title: "", subtitle: "" };
  }
  return {
    id: crypto.randomUUID(),
    layout: layout.id,
    blocks: layout.blockTypes.map(makeBlock),
  };
}

const FONT_SIZES = [14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64];
const COLOR_SWATCHES = ["#111827", "#dc2626", "#ea580c", "#16a34a", "#2563eb", "#7c3aed", "#ffffff"];

// ---------------------------------------------------------------------------
// Layout picker (unchanged behavior)
// ---------------------------------------------------------------------------

function LayoutPreview({ layout }) {
  if (layout.kind === "cover") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-sm bg-gray-400 px-3">
        <div className="h-2 w-2/3 rounded-sm bg-white" />
        <div className="h-1 w-1/3 rounded-sm bg-white/70" />
      </div>
    );
  }
  if (layout.blockTypes.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-[10px] text-gray-300">Empty</span>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col justify-center gap-1.5 px-3">
      {layout.blockTypes.map((type, i) => {
        if (type === "title") return <div key={i} className="h-2.5 w-2/3 rounded-sm bg-gray-700" />;
        if (type === "image") return <div key={i} className="h-6 w-full rounded-sm bg-gray-300" />;
        return (
          <div key={i} className="space-y-1">
            <div className="h-1 w-full rounded-sm bg-gray-300" />
            <div className="h-1 w-5/6 rounded-sm bg-gray-300" />
            <div className="h-1 w-4/6 rounded-sm bg-gray-300" />
          </div>
        );
      })}
    </div>
  );
}

function LayoutPickerModal({ open, onOpenChange, onSelect }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose a layout</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-3">
          {LAYOUTS.map((layout) => (
            <button
              key={layout.id}
              type="button"
              onClick={() => onSelect(layout)}
              className="group rounded-lg border p-2 text-left transition hover:border-black"
            >
              <div className="h-24 w-full rounded-md border border-dashed bg-white">
                <LayoutPreview layout={layout} />
              </div>
              <p className="mt-2 text-xs font-medium text-gray-700 group-hover:text-black">{layout.name}</p>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Image library (unchanged behavior)
// ---------------------------------------------------------------------------

function ImageLibraryModal({ open, onOpenChange, images, onAddImage, onSelectImage, targetLabel }) {
  const [urlInput, setUrlInput] = useState("");

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    onAddImage({ id: crypto.randomUUID(), url: trimmed, name: trimmed });
    setUrlInput("");
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => onAddImage({ id: crypto.randomUUID(), url: reader.result, name: file.name });
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Image Library</DialogTitle>
        </DialogHeader>

        {targetLabel && (
          <p className="-mt-2 text-sm text-gray-500">
            Selecting for: <span className="font-medium">{targetLabel}</span>
          </p>
        )}

        <div className="flex flex-col gap-3 border-b pb-4">
          <div className="flex gap-2">
            <Input
              className="h-10"
              placeholder="Paste an image URL"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
            />
            <Button type="button" onClick={handleAddUrl} className="text-xs">
              Add URL
            </Button>
          </div>
          <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-xs text-gray-600 hover:bg-gray-50">
            <Upload size={14} />
            Upload from device
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} />
          </label>
        </div>

        {images.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-gray-400">
            No images yet — add one above to get started
          </div>
        ) : (
          <div className="grid max-h-[50vh] grid-cols-4 gap-3 overflow-y-auto pr-1">
            {images.map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => onSelectImage(img)}
                className="group relative aspect-square overflow-hidden rounded-lg border hover:ring-2 hover:ring-black"
                title={img.name}
              >
                <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 hidden items-center justify-center bg-black/40 group-hover:flex">
                  <Check className="text-white" size={20} />
                </div>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Editable text — contentEditable that owns its own DOM text after mount.
// React never re-injects `value` as children on every keystroke (that's what
// was causing the cursor-jump / "backwards typing" and the stuck placeholder).
// Empty state is shown via a real CSS placeholder, not fallback text baked
// into the editable content.
// ---------------------------------------------------------------------------

function EditableText({ as: Tag = "div", value, onChange, onFocus, placeholder, style, className }) {
  const ref = useRef(null);

  // Sync DOM <- state exactly once, on mount. After that the DOM owns the
  // text; onInput pushes DOM -> state, but state changes never push back
  // into the DOM (which is what caused the reset-to-start-of-line bug).
  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = value || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onFocus={onFocus}
      onInput={(e) => onChange(e.currentTarget.textContent)}
      style={style}
      className={className}
    />
  );
}

// A real placeholder: shows only while the element has zero child nodes,
// disappears the instant any character is typed, reappears if fully cleared.
function EditablePlaceholderStyles() {
  return (
    <style>{`
      [contenteditable][data-placeholder]:empty::before {
        content: attr(data-placeholder);
        color: #9ca3af;
        pointer-events: none;
      }
    `}</style>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export default function ArticleBuilder() {
  const [article, setArticle] = useState({
    title: "",
    pages: [makePageFromLayout(LAYOUTS[0])],
  });
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const [imageLibrary, setImageLibrary] = useState([]);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryTarget, setLibraryTarget] = useState(null);

  const [layoutPickerOpen, setLayoutPickerOpen] = useState(false);

  // Which text block the formatting toolbar currently acts on
  const [activeBlock, setActiveBlock] = useState(null); // { pageId, blockId }

  const activePage = article.pages[currentPageIndex];
  const activeBlockObj =
    activeBlock &&
    article.pages.find((p) => p.id === activeBlock.pageId)?.blocks?.find((b) => b.id === activeBlock.blockId);

  // --- navigation ---
  const goToPage = (index) => setCurrentPageIndex(Math.max(0, Math.min(index, article.pages.length - 1)));
  const goPrev = () => goToPage(currentPageIndex - 1);
  const goNext = () => goToPage(currentPageIndex + 1);

  // --- page mutations ---
  const updatePage = (id, field, value) => {
    setArticle((prev) => ({
      ...prev,
      pages: prev.pages.map((page) => (page.id === id ? { ...page, [field]: value } : page)),
    }));
  };

  const removePage = (pageId) => {
    if (article.pages.length <= 1) return;
    setArticle((prev) => ({ ...prev, pages: prev.pages.filter((page) => page.id !== pageId) }));
    setCurrentPageIndex((prevIndex) => Math.max(0, Math.min(prevIndex, article.pages.length - 2)));
  };

  // --- block mutations ---
  const addBlock = (pageId, type) => {
    setArticle((prev) => ({
      ...prev,
      pages: prev.pages.map((page) =>
        page.id !== pageId ? page : { ...page, blocks: [...page.blocks, makeBlock(type)] }
      ),
    }));
  };

  const removeBlock = (pageId, blockId) => {
    setArticle((prev) => ({
      ...prev,
      pages: prev.pages.map((page) =>
        page.id !== pageId ? page : { ...page, blocks: page.blocks.filter((b) => b.id !== blockId) }
      ),
    }));
    setActiveBlock((prev) => (prev?.blockId === blockId ? null : prev));
  };

  const updateBlockText = (pageId, blockId, text) => {
    setArticle((prev) => ({
      ...prev,
      pages: prev.pages.map((page) =>
        page.id !== pageId
          ? page
          : { ...page, blocks: page.blocks.map((b) => (b.id === blockId ? { ...b, text } : b)) }
      ),
    }));
  };

  const updateBlockSrc = (pageId, blockId, src) => {
    setArticle((prev) => ({
      ...prev,
      pages: prev.pages.map((page) =>
        page.id !== pageId
          ? page
          : { ...page, blocks: page.blocks.map((b) => (b.id === blockId ? { ...b, src } : b)) }
      ),
    }));
  };

  const updateBlockStyle = (pageId, blockId, field, value) => {
    setArticle((prev) => ({
      ...prev,
      pages: prev.pages.map((page) =>
        page.id !== pageId
          ? page
          : {
              ...page,
              blocks: page.blocks.map((b) =>
                b.id === blockId ? { ...b, style: { ...b.style, [field]: value } } : b
              ),
            }
      ),
    }));
  };

  const createPageFromLayout = (layout) => {
    const newPage = makePageFromLayout(layout);
    setArticle((prev) => ({ ...prev, pages: [...prev.pages, newPage] }));
    setLayoutPickerOpen(false);
    setCurrentPageIndex(article.pages.length);
  };

  // --- image library ---
  const addImageToLibrary = (image) => setImageLibrary((prev) => [image, ...prev]);
  const openLibraryFor = (target) => {
    setLibraryTarget(target);
    setLibraryOpen(true);
  };
  const handleSelectImage = (image) => {
    if (!libraryTarget) return;
    if (libraryTarget.mode === "cover") updatePage(libraryTarget.pageId, "coverImage", image.url);
    if (libraryTarget.mode === "block") updateBlockSrc(libraryTarget.pageId, libraryTarget.blockId, image.url);
    setLibraryOpen(false);
    setLibraryTarget(null);
  };

  return (
    <div className="space-y-4">
      <EditablePlaceholderStyles />

      {/* ---------------- Toolbar ---------------- */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-white p-2 shadow-sm">
        {/* Page / image actions */}
        <div className="flex items-center gap-2">
          <Button type="button" onClick={() => setLayoutPickerOpen(true)} className="rounded-lg p-2 text-xs">
            <LayoutTemplate size={14} className="mr-1" />
            Add Page
          </Button>
          {/* <Button
            type="button"
            onClick={() => {
              if (!activePage || activePage.layout === "cover") return;
              const block = makeBlock("image");
              setArticle((prev) => ({
                ...prev,
                pages: prev.pages.map((p) =>
                  p.id !== activePage.id ? p : { ...p, blocks: [...p.blocks, block] }
                ),
              }));
              openLibraryFor({ mode: "block", pageId: activePage.id, blockId: block.id });
            }}
            className="rounded-lg p-2 text-xs"
          >
            <Images size={14} className="mr-1" />
            Insert Image
          </Button> */}
        </div>

        <div className="h-6 w-px bg-gray-200" />

        {/* Text formatting — acts on whichever block was last clicked into */}
        <div
          className={`flex items-center gap-2 ${!activeBlockObj ? "pointer-events-none opacity-30" : ""}`}
          title={!activeBlockObj ? "Click into a title or paragraph to format it" : undefined}
        >
          <select
            value={activeBlockObj?.style?.fontSize ?? 16}
            onChange={(e) =>
              activeBlock && updateBlockStyle(activeBlock.pageId, activeBlock.blockId, "fontSize", Number(e.target.value))
            }
            className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs"
          >
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() =>
              activeBlock &&
              updateBlockStyle(
                activeBlock.pageId,
                activeBlock.blockId,
                "fontWeight",
                activeBlockObj?.style?.fontWeight === 700 ? 400 : 700
              )
            }
            className={`flex h-8 w-8 items-center justify-center rounded-md border text-xs ${
              activeBlockObj?.style?.fontWeight === 700
                ? "border-black bg-black text-white"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Bold size={14} />
          </button>

          <button
            type="button"
            onClick={() =>
              activeBlock &&
              updateBlockStyle(
                activeBlock.pageId,
                activeBlock.blockId,
                "fontStyle",
                activeBlockObj?.style?.fontStyle === "italic" ? "normal" : "italic"
              )
            }
            className={`flex h-8 w-8 items-center justify-center rounded-md border text-xs ${
              activeBlockObj?.style?.fontStyle === "italic"
                ? "border-black bg-black text-white"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Italic size={14} />
          </button>

          {/* Color bar */}
          <div className="flex items-center gap-1 rounded-md border border-gray-200 p-1">
            {COLOR_SWATCHES.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => activeBlock && updateBlockStyle(activeBlock.pageId, activeBlock.blockId, "color", color)}
                style={{ backgroundColor: color }}
                className={`h-5 w-5 rounded-full border ${
                  activeBlockObj?.style?.color === color ? "ring-2 ring-black ring-offset-1" : "border-gray-300"
                }`}
                aria-label={`Set color ${color}`}
              />
            ))}
            <input
              type="color"
              value={activeBlockObj?.style?.color ?? "#111827"}
              onChange={(e) =>
                activeBlock && updateBlockStyle(activeBlock.pageId, activeBlock.blockId, "color", e.target.value)
              }
              className="h-5 w-5 cursor-pointer rounded-full border border-gray-300 bg-transparent p-0"
              title="Custom color"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={currentPageIndex === 0}
            className="rounded-full border bg-white p-1.5 shadow-sm disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex gap-1.5 rounded-full border px-2.5 py-1.5">
            {article.pages.map((page, index) => (
              <button
                key={page.id}
                type="button"
                onClick={() => goToPage(index)}
                aria-label={`Go to page ${index + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentPageIndex ? "w-5 bg-black" : "w-1.5 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            disabled={currentPageIndex === article.pages.length - 1}
            className="rounded-full border bg-white p-1.5 shadow-sm disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>

          <span className="text-xs text-gray-400">
            {currentPageIndex + 1} / {article.pages.length}
          </span>
        </div>
      </div>

      {/* ---------------- Canvas (this IS the editor now) ---------------- */}
      <div className="relative mx-auto h-[80vh] w-full max-w-5xl overflow-hidden rounded-xl border bg-white shadow-sm">
        {activePage && activePage.layout === "cover" ? (
          <div className="group relative h-full w-full">
            {activePage.coverImage ? (
              <img src={activePage.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gray-300" />
            )}
            <div className="absolute inset-0 bg-black/40" />

            {/* Change / remove cover image, visible on hover */}
            <div className="absolute top-4 left-4 justify-center gap-3 group-hover:flex">
              <button
                type="button"
                onClick={() => openLibraryFor({ mode: "cover", pageId: activePage.id })}
                className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium shadow"
              >
                <Pencil size={12} />
                {activePage.coverImage ? "Change image" : "Choose image"}
              </button>
              {activePage.coverImage && (
                <button
                  type="button"
                  onClick={() => updatePage(activePage.id, "coverImage", "")}
                  className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-red-600 shadow"
                >
                  <X size={12} />
                  Remove
                </button>
              )}
            </div>

            {/* Editable title / subtitle, directly in the canvas */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="pointer-events-auto max-w-3xl px-8 text-center text-white">
                <EditableText
                  as="h1"
                  value={activePage.title}
                  onChange={(text) => updatePage(activePage.id, "title", text)}
                  placeholder="Article Title"
                  className="text-5xl font-bold outline-none focus:ring-1 focus:ring-white/50 rounded"
                />
                <EditableText
                  as="p"
                  value={activePage.subtitle}
                  onChange={(text) => updatePage(activePage.id, "subtitle", text)}
                  placeholder="Article Subtitle"
                  className="mt-4 text-xl outline-none focus:ring-1 focus:ring-white/50 rounded"
                />
              </div>
            </div>

            {article.pages.length > 1 && (
              <button
                type="button"
                onClick={() => removePage(activePage.id)}
                className="absolute right-4 top-4 hidden rounded-full bg-white/90 p-2 text-red-600 shadow group-hover:block"
                aria-label="Remove page"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ) : (
          activePage && (
            <div className="group/page relative h-full overflow-y-auto">
              <div className="mx-auto max-w-3xl p-10">
                {activePage.blocks?.length === 0 && (
                  <p className="rounded-lg border border-dashed py-10 text-center text-sm text-gray-400">
                    This page is empty — add a block below
                  </p>
                )}

                {activePage.blocks?.map((block) => (
                  <div key={block.id} className="group/block relative mb-6">
                    {block.type === "title" && (
                      <EditableText
                        as="h2"
                        value={block.text}
                        onChange={(text) => updateBlockText(activePage.id, block.id, text)}
                        onFocus={() => setActiveBlock({ pageId: activePage.id, blockId: block.id })}
                        placeholder="Heading"
                        style={{
                          fontSize: block.style?.fontSize,
                          fontWeight: block.style?.fontWeight,
                          fontStyle: block.style?.fontStyle,
                          color: block.style?.color,
                        }}
                        className="rounded outline-none focus:ring-1 focus:ring-gray-300"
                      />
                    )}

                    {block.type === "paragraph" && (
                      <EditableText
                        as="p"
                        value={block.text}
                        onChange={(text) => updateBlockText(activePage.id, block.id, text)}
                        onFocus={() => setActiveBlock({ pageId: activePage.id, blockId: block.id })}
                        placeholder="Write something…"
                        style={{
                          fontSize: block.style?.fontSize,
                          fontWeight: block.style?.fontWeight,
                          fontStyle: block.style?.fontStyle,
                          color: block.style?.color,
                        }}
                        className="whitespace-pre-wrap rounded leading-8 outline-none focus:ring-1 focus:ring-gray-300"
                      />
                    )}

                    {block.type === "image" &&
                      (block.src ? (
                        <div className="group/image relative w-full overflow-hidden rounded-xl">
                          <img src={block.src} alt="" className="w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => openLibraryFor({ mode: "block", pageId: activePage.id, blockId: block.id })}
                            className="absolute inset-0 hidden items-center justify-center gap-2 bg-black/40 text-white group-hover/image:flex"
                          >
                            <Pencil size={16} />
                            <span className="text-sm font-medium">Change image</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openLibraryFor({ mode: "block", pageId: activePage.id, blockId: block.id })}
                          className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-gray-400 hover:bg-gray-50"
                        >
                          <ImageIcon size={24} />
                          <span className="text-xs">Choose image</span>
                        </button>
                      ))}

                    {/* Per-block remove control */}
                    <button
                      type="button"
                      onClick={() => removeBlock(activePage.id, block.id)}
                      className="absolute -right-3 -top-3 hidden h-6 w-6 items-center justify-center rounded-full border bg-white text-red-500 shadow group-hover/block:flex"
                      aria-label="Remove block"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}

                {/* Add block, directly in the canvas */}
                <div className="mt-4 flex items-center gap-2 border-t pt-4">
                  <span className="text-xs text-gray-400">Add:</span>
                  <button
                    type="button"
                    onClick={() => addBlock(activePage.id, "title")}
                    className="flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200"
                  >
                    <Heading size={13} />
                    Title
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock(activePage.id, "image")}
                    className="flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200"
                  >
                    <ImageIcon size={13} />
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock(activePage.id, "paragraph")}
                    className="flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200"
                  >
                    <AlignLeft size={13} />
                    Paragraph
                  </button>
                </div>
              </div>

              {article.pages.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePage(activePage.id)}
                  className="absolute right-4 top-4 hidden rounded-full border bg-white p-2 text-red-500 shadow group-hover/page:block"
                  aria-label="Remove page"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )
        )}
      </div>

      <ImageLibraryModal
        open={libraryOpen}
        onOpenChange={setLibraryOpen}
        images={imageLibrary}
        onAddImage={addImageToLibrary}
        onSelectImage={handleSelectImage}
        targetLabel={libraryTarget?.mode === "cover" ? "Cover image" : libraryTarget ? "Image block" : ""}
      />

      <LayoutPickerModal open={layoutPickerOpen} onOpenChange={setLayoutPickerOpen} onSelect={createPageFromLayout} />
    </div>
  );
}