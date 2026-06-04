'use client';

import React from 'react';
import katex from 'katex';

interface MarkdownMathCodeProps {
  content: string;
}

export default function MarkdownMathCode({ content }: MarkdownMathCodeProps) {
  // Simple custom parser for markdown, LaTeX math, and code blocks
  if (!content) return null;

  // Split content by code blocks ```lang ... ```
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 leading-relaxed">
      {parts.map((part, index) => {
        // If it's a code block
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const language = lines[0] ? lines[0].trim() : 'javascript';
          const code = lines.slice(1).join('\n');

          return (
            <div key={`code-${index}`} className="my-4 overflow-hidden rounded-xl border border-white/10 bg-[#07070B] font-mono text-xs">
              <div className="flex items-center justify-between bg-white/[0.03] px-4 py-2 border-b border-white/5 text-gray-400">
                <span>{language}</span>
                <span className="text-[10px] uppercase">Auto-Detected</span>
              </div>
              <pre className="p-4 overflow-x-auto text-[#00D4AA] select-all leading-normal">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        // Parse math equations (inline $...$ and block $$...$$) in regular text
        const textParts = part.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);

        return (
          <p key={`text-${index}`} className="whitespace-pre-line text-sm text-gray-200">
            {textParts.map((tPart, tIdx) => {
              // Block math $$ ... $$
              if (tPart.startsWith('$$') && tPart.endsWith('$$')) {
                const equation = tPart.slice(2, -2).trim();
                try {
                  const html = katex.renderToString(equation, { displayMode: true, throwOnError: false });
                  return <span key={`math-block-${tIdx}`} dangerouslySetInnerHTML={{ __html: html }} className="block my-3 overflow-x-auto text-center" />;
                } catch {
                  return <code key={`math-block-err-${tIdx}`} className="block my-3 text-center text-red-400">{tPart}</code>;
                }
              }

              // Inline math $ ... $
              if (tPart.startsWith('$') && tPart.endsWith('$')) {
                const equation = tPart.slice(1, -1).trim();
                try {
                  const html = katex.renderToString(equation, { displayMode: false, throwOnError: false });
                  return <span key={`math-inline-${tIdx}`} dangerouslySetInnerHTML={{ __html: html }} className="inline-block px-0.5" />;
                } catch {
                  return <code key={`math-inline-err-${tIdx}`} className="text-red-400">{tPart}</code>;
                }
              }

              // Regular text: parse simple bold/italic markdown replacements
              let formattedText: React.ReactNode = tPart;
              
              // Handle bold **text**
              if (tPart.includes('**')) {
                const boldParts = tPart.split(/\*\*(.*?)\*\*/g);
                formattedText = boldParts.map((bp, bIdx) => 
                  bIdx % 2 === 1 ? <strong key={`bold-${bIdx}`} className="text-[#6C63FF] font-bold">{bp}</strong> : bp
                );
              }

              return <span key={`raw-${tIdx}`}>{formattedText}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}
