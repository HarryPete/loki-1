"use client";

import { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function ArticlePreview({ pages = [], emblaRef, emblaApi }) {
  return (
    <div className="relative h-[80vh]">
      <div
        ref={emblaRef}
        className="overflow-hidden rounded-xl border bg-white"
      >
        
        <div className="flex h-[80vh]">
          {pages.map((page, index) => (
            <div
              key={page.id}
              className="flex-[0_0_100%] min-w-0"
            >
              {!(page.type === "cover") && <p className="p-4 text-xs absolute w-full">Page {index}</p>}
              {page.type === "cover" ? (
                <div className="relative h-[80vh]">
                  {page.coverImage ? (
                    <img
                      src={page.coverImage}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-300" />
                  )}

                  <div className="absolute inset-0 bg-black/40" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="max-w-3xl px-8 text-center text-white">
                      <h1 className="text-5xl font-bold">
                        {page.title || "Article Title"}
                      </h1>

                      <p className="mt-4 text-xl">
                        {page.subtitle || "Article Subtitle"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="min-h-[90vh]">
                  <div className="mx-auto max-w-4xl p-10">
                    {page.blocks?.length ? (
                      page.blocks.map((block) => (
                        <div key={block.id}>
                          {block.type === "title" && (
                            <h2 className="mb-6 text-4xl font-bold">
                              {block.text}
                            </h2>
                          )}

                          {block.type === "image" && (
                            <img
                              src={block.src}
                              alt=""
                              className="mb-6 w-full rounded-xl object-cover"
                            />
                          )}

                          {block.type === "paragraph" && (
                            <p className="mb-6 whitespace-pre-wrap leading-8 text-lg">
                              {block.text}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="flex h-[500px] items-center justify-center text-gray-400">
                        Add blocks to this page
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow"
      >
        <ChevronLeft />
      </button>

      <button
        type="button"
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow"
      >
        <ChevronRight />
      </button>
    </div>
  );
}

export default function ArticleBuilder() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
  });
  const [currentPage, setCurrentPage] = useState(0)
  const [article, setArticle] = useState({
    title: "",
    pages: [
      {
        id: crypto.randomUUID(),
        type: "cover",
        coverImage: "",
        title: "",
        subtitle: "",
      },
    ],
  });

  const updatePage = (id, field, value) => {
    setArticle((prev) => ({
      ...prev,
      pages: prev.pages.map((page) =>
        page.id === id ? { ...page, [field]: value } : page
      ),
    }));
  };

  const removePage = (pageId) => {
    setArticle((prev) => ({
        ...prev,
        pages: prev.pages.filter((page) => page.id !== pageId),
    }));
  };

  const addBlock = (pageId, type) => {
    setArticle((prev) => ({
        ...prev,
        pages: prev.pages.map((page) => {
        if (page.id !== pageId) return page;

        return {
            ...page,
            blocks: [
            ...page.blocks,
            {
                id: crypto.randomUUID(),
                type,
                ...(type === "title" && { text: "" }),
                ...(type === "paragraph" && { text: "" }),
                ...(type === "image" && { src: "" }),
            },
            ],
        };
        }),
    }));
    };

    const updateBlock = (pageId, blockId, field, value) => {
    setArticle((prev) => ({
        ...prev,
        pages: prev.pages.map((page) => {
        if (page.id !== pageId) return page;

        return {
            ...page,
            blocks: page.blocks.map((block) =>
            block.id === blockId
                ? { ...block, [field]: value }
                : block
            ),
        };
        }),
    }));
    };

    const addPage = () => {
        setArticle((prev) => ({
            ...prev,
            pages: [
            ...prev.pages,
            {
                id: crypto.randomUUID(),
                type: "page",
                blocks: [],
            },
            ],
        }));

        setTimeout(() => {
            emblaApi?.scrollTo(article.pages.length);
        }, 0);
    };

  return (
  <div className="grid grid-cols-2 gap-8">
    
    {/* Editor */}
    <div className="space-y-4 h-[80vh] overflow-y-auto">
        <div className="space-x-2">
            
        <Button
        type="button"
        onClick={addPage}
        className="rounded-lg p-2 text-xs">
            Add Page
        </Button>
        <Button
        type="button"
        onClick={addPage}
        className="rounded-lg p-2 text-xs">
            Image Library
        </Button>
        </div>
      {article.pages.map((page, index) => (
        <div
          key={page.id}
          className="rounded-lg border p-4"
        >
          <h3 className="mb-4 text-xl font-semibold hover:cursor-pointer" onClick={()=> emblaApi?.scrollTo(index)}>
            {index === 0 ? "Cover Page" : `Page ${index}`}
          </h3>

          {page.type === "cover" ? (
            <>
              <Input
                className="mb-3 w-full rounded-lg p-2 h-12"
                placeholder="Cover Image URL"
                value={page.coverImage}
                onChange={(e) =>
                  updatePage(
                    page.id,
                    "coverImage",
                    e.target.value
                  )
                }
              />

              <Input
                className="mb-3 w-full rounded-lg p-2 h-12"
                placeholder="Title"
                value={page.title}
                onChange={(e) =>
                  updatePage(
                    page.id,
                    "title",
                    e.target.value
                  )
                }
              />

              <Textarea
                rows={10}
                className="w-full rounded-lg p-2"
                placeholder="Subtitle"
                value={page.subtitle}
                onChange={(e) =>
                  updatePage(
                    page.id,
                    "subtitle",
                    e.target.value
                  )
                }
              />
            </>
          ) : (
            <>
              <div className="mb-4 flex gap-2">
                <Button
                  type="button"
                  onClick={() => addBlock(page.id, "title")}
                  className="rounded-lg p-2 text-xs"
                >
                  + Title
                </Button>

                <Button
                  type="button"
                  onClick={() => addBlock(page.id, "image")}
                  className="rounded-lg p-2 text-xs"
                >
                  + Image
                </Button>

                <Button
                  type="button"
                  onClick={() => addBlock(page.id, "paragraph")}
                  className="rounded-lg p-2 text-xs"
                >
                  + Paragraph
                </Button>

                <Button
                  type="button"
                  onClick={() => removePage(page.id)}
                  className="rounded-lg p-2 text-xs"
                >
                  - Remove
                </Button>
              </div>

              {page.blocks?.map((block) => (
                <div
                  key={block.id}
                  className="mb-4 rounded"
                >
                  {block.type === "title" && (
                    <Input
                      className="w-full rounded-lg p-2 h-12"
                      value={block.text}
                      placeholder="Title"
                      onChange={(e) =>
                        updateBlock(
                          page.id,
                          block.id,
                          "text",
                          e.target.value
                        )
                      }
                    />
                  )}

                  {block.type === "image" && (
                    <Input
                      className="w-full rounded-lg p-2 h-12"
                      value={block.src}
                      placeholder="Image URL"
                      onChange={(e) =>
                        updateBlock(
                          page.id,
                          block.id,
                          "src",
                          e.target.value
                        )
                      }
                    />
                  )}

                  {block.type === "paragraph" && (
                    <Textarea
                      rows={20}
                      className="w-full rounded-lg p-2"
                      value={block.text}
                      placeholder="Paragraph"
                      onChange={(e) =>
                        updateBlock(
                          page.id,
                          block.id,
                          "text",
                          e.target.value
                        )
                      }
                    />
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      ))}

      {/* <div className="flex gap-2">
        {article.pages.map((page, index)=>
        <Button 
            className="rounded-full" 
            type="button" key={index}
            onClick={()=> 
            {
                setCurrentPage(index)
                emblaApi.scrollTo(index)}
            }>
            {index+1}
        </Button>
      )}
      </div> */}

      {/* <Button
        type="button"
        onClick={addPage}
        className="rounded-lg p-2 text-xs"
      >
        Add Page
      </Button> */}
    </div>

    {/* Live Preview Carousel */}
    <ArticlePreview pages={article?.pages ?? []} emblaRef={emblaRef} emblaApi={emblaApi}/>
  </div>
);
}