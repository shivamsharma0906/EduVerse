// Mock AI Streaming Response Utilities

export interface MockMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  modelUsed?: string;
  tokensUsed?: number;
  toolCall?: {
    type: 'quiz' | 'diagram' | 'course_link';
    data: any;
  };
}

export interface AIResponseTemplate {
  model: string;
  content: string;
  toolCall?: {
    type: 'quiz' | 'diagram' | 'course_link';
    data: any;
  };
}

const RESPONSES_NORMAL: AIResponseTemplate[] = [
  {
    model: 'Claude 3.5 Sonnet',
    content: `Sure! I can help you understand **Linear Transformations** in vector spaces. 

A linear transformation is a mapping $T: V \\to W$ that preserves the operations of addition and scalar multiplication. Mathematically, it satisfies:
1. $$T(u + v) = T(u) + T(v)$$
2. $$T(c u) = c T(u)$$

To visualize this, think of it as grid stretching. Here is a matrix transformation mapping:
$$T\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 2 & 1 \\\\ 0 & 1 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix}$$

This transformation shears the space horizontally. Let me draw the resulting grid transformation for you.`,
    toolCall: {
      type: 'diagram',
      data: {
        title: 'Shear Transformation Grid',
        svg: `<svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto stroke-teal-400 fill-none stroke-[2]">
          <!-- Original Grid (Dotted) -->
          <path d="M 20 20 L 20 180 M 60 20 L 60 180 M 100 20 L 100 180 M 140 20 L 140 180 M 180 20 L 180 180" stroke="#3A3A4F" stroke-dasharray="2" />
          <path d="M 20 20 L 180 20 M 20 60 L 180 60 M 20 100 L 180 100 M 20 140 L 180 140 M 20 180 L 180 180" stroke="#3A3A4F" stroke-dasharray="2" />
          <!-- Sheared Grid (Solid) -->
          <path d="M 20 20 L 60 180 M 60 20 L 100 180 M 100 20 L 140 180 M 140 20 L 180 180" stroke="#6C63FF" />
          <path d="M 20 20 L 180 20 M 30 60 L 190 60 M 40 100 L 200 100 M 50 140 L 210 140 M 60 180 L 220 180" stroke="#00D4AA" />
        </svg>`
      }
    }
  },
  {
    model: 'GPT-4o (Coding Mode)',
    content: `Here is the JavaScript code to check if a string is a palindrome. It implements an $O(n)$ time complexity solution with $O(1)$ extra space.

\`\`\`javascript
function isPalindrome(str) {
  // Regex to remove non-alphanumeric characters and lowercase the string
  const cleanStr = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  
  let left = 0;
  let right = cleanStr.length - 1;
  
  while (left < right) {
    if (cleanStr[left] !== cleanStr[right]) {
      return false; // Mismatch found
    }
    left++;
    right--;
  }
  return true;
}
\`\`\`

Would you like me to generate a quick practice quiz to test your understanding of algorithmic optimization?`,
    toolCall: {
      type: 'quiz',
      data: {
        questionId: 'q-cs-1',
        question: 'What is the space complexity of the optimal in-place palindrome checker written above?',
        options: ['O(n) space', 'O(1) space', 'O(log n) space', 'O(n^2) space'],
        correctAnswer: 'O(1) space'
      }
    }
  }
];

const RESPONSES_SOCRATIC: AIResponseTemplate[] = [
  {
    model: 'Claude 3.5 Sonnet (Socratic)',
    content: `I see you are working on Big O complexity. Instead of giving you the complexity of QuickSort directly, let's explore it together.

Imagine you have an array: \`[5, 3, 8, 4, 2, 7]\`.
If we always choose the *first* element as our pivot (which is \`5\`), we split the array into elements smaller than 5 and larger than 5. 

What happens to our splits if the array is already sorted like \`[2, 3, 4, 5, 7, 8]\`? How many elements will be on the left and right side of our pivot at each step? Write down your thoughts!`,
  },
  {
    model: 'Claude 3.5 Sonnet (Socratic)',
    content: `Great start. In the vector equation $$T(u + v) = T(u) + T(v)$$, we state that transforming the sum of two vectors gives the same result as summing their individual transformations.

If we define a transformation:
$$T\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} x^2 \\\\ y \\end{pmatrix}$$

Does this hold true if you double the input vector? Let's check with $$u = \\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix}$$. Calculate $$T(2u)$$ and compare it with $$2 T(u)$$. What do you notice?`
  }
];

/**
 * Simulates a streaming chat response
 */
export function simulateAIResponseStream(
  userPrompt: string,
  isSocratic: boolean,
  onChunk: (text: string, done: boolean, modelUsed: string, toolCall?: any) => void
) {
  const triggerText = userPrompt.toLowerCase();
  
  // Choose response templates based on trigger keywords and socratic mode
  let selected = RESPONSES_NORMAL[0];

  if (isSocratic) {
    selected = triggerText.includes('vector') || triggerText.includes('math')
      ? RESPONSES_SOCRATIC[1]
      : RESPONSES_SOCRATIC[0];
  } else {
    if (triggerText.includes('code') || triggerText.includes('javascript') || triggerText.includes('palindrome') || triggerText.includes('sort')) {
      selected = RESPONSES_NORMAL[1];
    } else {
      selected = RESPONSES_NORMAL[0];
    }
  }

  let currentText = '';
  const totalLength = selected.content.length;
  let index = 0;
  
  const interval = setInterval(() => {
    // Stream 4-8 characters at a time for realism
    const chunkSize = Math.floor(Math.random() * 5) + 3;
    const nextText = selected.content.slice(index, index + chunkSize);
    currentText += nextText;
    index += chunkSize;

    if (index >= totalLength) {
      clearInterval(interval);
      onChunk(selected.content, true, selected.model, selected.toolCall);
    } else {
      onChunk(currentText, false, selected.model);
    }
  }, 35);
}
