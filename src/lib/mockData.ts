import { IRTQuestion } from './irt';

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  contentType: 'video' | 'article' | 'interactive' | 'quiz';
  contentUrl?: string;
  contentBody: {
    markdown?: string;
    videoUrl?: string;
    questions?: IRTQuestion[];
  };
  orderIndex: number;
  xpReward: number;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
  estimatedMinutes: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnailUrl: string;
  isPublished: boolean;
  authorId: string;
  modules: Module[];
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  icon: string;
  colorHex: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  description: string;
  skillsRequired: string[];
  sourceUrl: string;
  matchScore?: number;
}

// 1. Subjects Seed
export const MOCK_SUBJECTS: Subject[] = [
  { id: 'sub-cs', name: 'Computer Science', slug: 'computer-science', icon: 'Code', colorHex: '#6C63FF' },
  { id: 'sub-math', name: 'Mathematics', slug: 'mathematics', icon: 'Binary', colorHex: '#00D4AA' },
  { id: 'sub-science', name: 'Quantum Physics', slug: 'quantum-physics', icon: 'Atom', colorHex: '#FF6B6B' },
  { id: 'sub-bio', name: 'Molecular Biology', slug: 'molecular-biology', icon: 'Dna', colorHex: '#FFB800' }
];

// 2. Questions Seed for IRT assessments
export const MOCK_QUESTIONS: IRTQuestion[] = [
  // Computer Science - Algorithms Questions
  {
    id: 'q-cs-1',
    body: 'What is the worst-case time complexity of QuickSort?',
    type: 'mcq',
    options: ['O(n log n)', 'O(n^2)', 'O(n)', 'O(2^n)'],
    correctAnswer: 'O(n^2)',
    difficulty: -0.5, // Relatively easy/medium
    discrimination: 1.2,
    guessing: 0.25,
    bloomLevel: 'understanding'
  },
  {
    id: 'q-cs-2',
    body: 'Which data structure uses LIFO (Last In First Out) ordering?',
    type: 'mcq',
    options: ['Queue', 'Stack', 'Heap', 'Graph'],
    correctAnswer: 'Stack',
    difficulty: -1.5, // Very easy
    discrimination: 1.0,
    guessing: 0.25,
    bloomLevel: 'remembering'
  },
  {
    id: 'q-cs-3',
    body: 'Explain when you would use a Hash Map instead of a Binary Search Tree.',
    type: 'essay',
    correctAnswer: 'Use Hash Map for O(1) average lookup when ordering is not needed. Use BST (O(log n)) when sorted traversal or range queries are required.',
    difficulty: 0.8, // Harder
    discrimination: 1.8,
    guessing: 0.0, // Essay has no guessing chance
    bloomLevel: 'analyzing'
  },
  {
    id: 'q-cs-4',
    body: 'Implement a function `isPalindrome(str)` in JavaScript that returns true if the string is a palindrome, ignoring spaces and capitalization.',
    type: 'code',
    correctAnswer: 'function isPalindrome(str) { const clean = str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase(); return clean === clean.split("").reverse().join(""); }',
    difficulty: 1.5, // Advanced
    discrimination: 2.1,
    guessing: 0.05,
    bloomLevel: 'creating'
  },
  {
    id: 'q-cs-5',
    body: 'What is the primary difference between a process and a thread?',
    type: 'short_answer',
    correctAnswer: 'Processes have separate memory spaces, while threads share the memory of their parent process.',
    difficulty: 0.2, // Medium
    discrimination: 1.4,
    guessing: 0.1,
    bloomLevel: 'understanding'
  },

  // Mathematics Questions
  {
    id: 'q-math-1',
    body: 'Evaluate the limit: $$\\lim_{x \\to 0} \\frac{\\sin(x)}{x}$$',
    type: 'mcq',
    options: ['0', '1', 'Undefined', 'Infinity'],
    correctAnswer: '1',
    difficulty: -0.8,
    discrimination: 1.1,
    guessing: 0.25,
    bloomLevel: 'remembering'
  },
  {
    id: 'q-math-2',
    body: 'Find the derivative of $$f(x) = x^2 \\ln(x)$$ with respect to x.',
    type: 'short_answer',
    correctAnswer: '2x ln(x) + x',
    difficulty: 0.5,
    discrimination: 1.5,
    guessing: 0.0,
    bloomLevel: 'applying'
  },
  {
    id: 'q-math-3',
    body: 'If a matrix A has dimensions 3x2 and matrix B has dimensions 2x4, what are the dimensions of product matrix AB?',
    type: 'mcq',
    options: ['2x2', '3x4', '2x4', 'Cannot be multiplied'],
    correctAnswer: '3x4',
    difficulty: -1.2,
    discrimination: 0.9,
    guessing: 0.25,
    bloomLevel: 'understanding'
  },
  {
    id: 'q-math-4',
    body: 'State and prove the Pythagorean Theorem using algebraic area completion.',
    type: 'essay',
    correctAnswer: 'Proof involves arranging four identical right triangles inside a square of side (a+b), showing that the inner square area c^2 equals (a+b)^2 - 4*(1/2*ab) = a^2 + b^2.',
    difficulty: 1.9,
    discrimination: 2.2,
    guessing: 0.0,
    bloomLevel: 'evaluating'
  }
];

// 3. Courses Seed
export const MOCK_COURSES: Course[] = [
  {
    id: 'c-algorithms',
    subjectId: 'sub-cs',
    title: 'Advanced Algorithms & Data Structures',
    description: 'Master recursion, dynamic programming, graph algorithms, and asymptotic complexity analysis to build high-performance software.',
    difficulty: 'intermediate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=400&q=80',
    isPublished: true,
    authorId: 'auth-teacher',
    modules: [
      {
        id: 'mod-1',
        courseId: 'c-algorithms',
        title: 'Asymptotic Analysis & Big O',
        orderIndex: 1,
        estimatedMinutes: 45,
        lessons: [
          {
            id: 'les-1-1',
            moduleId: 'mod-1',
            title: 'Understanding Big O Notation',
            contentType: 'article',
            xpReward: 50,
            orderIndex: 1,
            contentBody: {
              markdown: `## Introduction to Big O\n\nBig O notation is used in computer science to describe the performance or complexity of an algorithm. Specifically, it describes the **worst-case scenario**, representing the maximum execution time or space required.\n\n### Core Complexity Classes:\n- **$O(1)$** - Constant Time: Instant lookup, independent of input size.\n- **$O(\\log n)$** - Logarithmic Time: Binary Search.\n- **$O(n)$** - Linear Time: Single loops.\n- **$O(n \\log n)$** - Linearithmic Time: MergeSort, QuickSort.\n- **$O(n^2)$** - Quadratic Time: Nested loops.\n\n### Interactive Example\nConsider a function that prints all pairs in an array:\n\`\`\`javascript\nfunction printPairs(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length; j++) {\n      console.log(arr[i], arr[j]);\n    }\n  }\n}\n\`\`\`\nThis nested iteration makes it quadratic or **$O(n^2)$**.`
            }
          },
          {
            id: 'les-1-2',
            moduleId: 'mod-1',
            title: 'Space vs Time Tradeoffs',
            contentType: 'video',
            xpReward: 50,
            orderIndex: 2,
            contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            contentBody: {
              markdown: `### Space vs Time Tradeoffs\n\nIn algorithm design, you often trade memory for execution speed. For example:\n- **Caching / Memoization**: Storing previous results in memory ($O(n)$ space) to speed up recursive algorithms from $O(2^n)$ time to $O(n)$ time.\n- **In-place algorithms**: Optimizing space by modifying inputs directly, which sometimes requires extra steps (time) to arrange items.`
            }
          },
          {
            id: 'les-1-3',
            moduleId: 'mod-1',
            title: 'Module 1 Skill Check',
            contentType: 'quiz',
            xpReward: 100,
            orderIndex: 3,
            contentBody: {
              questions: [MOCK_QUESTIONS[0], MOCK_QUESTIONS[1], MOCK_QUESTIONS[4]]
            }
          }
        ]
      },
      {
        id: 'mod-2',
        courseId: 'c-algorithms',
        title: 'Dynamic Programming Masterclass',
        orderIndex: 2,
        estimatedMinutes: 90,
        lessons: [
          {
            id: 'les-2-1',
            moduleId: 'mod-2',
            title: 'Memoization vs Tabulation',
            contentType: 'interactive',
            xpReward: 75,
            orderIndex: 1,
            contentBody: {
              markdown: `### Memoization (Top-Down)\nMemoization solves subproblems on-demand and caches the results. It is recursive.\n\n### Tabulation (Bottom-Up)\nTabulation builds an array or table from scratch and resolves dependencies sequentially. It is iterative and avoids stack overflow.\n\nTry running the Fibonacci solver below to observe the calls!`
            }
          }
        ]
      }
    ]
  },
  {
    id: 'c-math',
    subjectId: 'sub-math',
    title: 'Linear Algebra & Quantum Prep',
    description: 'Understand vector spaces, eigenvalues, matrix transformations, and multi-dimensional coordinate mapping for quantum applications.',
    difficulty: 'advanced',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80',
    isPublished: true,
    authorId: 'auth-teacher',
    modules: [
      {
        id: 'mod-m1',
        courseId: 'c-math',
        title: 'Vector Spaces & Transformations',
        orderIndex: 1,
        estimatedMinutes: 60,
        lessons: [
          {
            id: 'les-m1-1',
            moduleId: 'mod-m1',
            title: 'Matrix Transformations',
            contentType: 'article',
            xpReward: 50,
            orderIndex: 1,
            contentBody: {
              markdown: `### Linear Transformations\nA transformation $T: V \\to W$ is linear if it preserves vector addition and scalar multiplication:\n1. $$T(u + v) = T(u) + T(v)$$\n2. $$T(c u) = c T(u)$$\n\nWe can represent any linear transformation as a matrix multiplication:\n$$T(x) = A x$$\n\nWhere matrix $A$ maps coordinates into the output basis space.`
            }
          },
          {
            id: 'les-m1-2',
            moduleId: 'mod-m1',
            title: 'Linear Vector Check',
            contentType: 'quiz',
            xpReward: 100,
            orderIndex: 2,
            contentBody: {
              questions: [MOCK_QUESTIONS[5], MOCK_QUESTIONS[7]]
            }
          }
        ]
      }
    ]
  }
];

// 4. Job Listings Seed (for Career Center)
export const MOCK_JOBS: JobListing[] = [
  {
    id: 'job-1',
    title: 'Senior AI Engineer',
    company: 'NeuralCorp',
    description: 'We are seeking an AI Engineer skilled in neural networks, LLM routing, pgvector indexing, and Next.js interfaces. You will develop conversational tutors and learning path recommendations.',
    skillsRequired: ['Next.js', 'TypeScript', 'PostgreSQL', 'pgvector', 'Python', 'Machine Learning', 'Linear Algebra', 'Algorithms'],
    sourceUrl: 'https://careers.neuralcorp.ai/job/1'
  },
  {
    id: 'job-2',
    title: 'Full-Stack Developer (L4)',
    company: 'Vercel Inc.',
    description: 'Join the Next.js framework team. Work on Server Actions, dynamic loading, Tailwind styling integration, and high performance edge routing.',
    skillsRequired: ['Next.js', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'React', 'HTML/CSS', 'Node.js', 'Algorithms'],
    sourceUrl: 'https://vercel.com/careers/fs-dev'
  },
  {
    id: 'job-3',
    title: 'Quantitative Research Analyst',
    company: 'AlphaFund',
    description: 'Utilize advanced statistics, eigenvalues, mathematical transformations, and machine learning models to identify algorithmic trading alpha.',
    skillsRequired: ['Mathematics', 'Linear Algebra', 'Python', 'Algorithms', 'SQL', 'Data Science'],
    sourceUrl: 'https://alphafund.com/careers/quant'
  }
];

// 5. Mock Users
export const MOCK_USERS = {
  student: {
    id: 'usr-student-1',
    email: 'shivam@eduverse.ai',
    full_name: 'Shivam Kumar',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    role: 'student',
    plan: 'free',
    onboarding_completed: true,
  },
  teacher: {
    id: 'auth-teacher',
    email: 'instructor@eduverse.ai',
    full_name: 'Dr. Helen Vance',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    role: 'teacher',
    plan: 'pro',
    onboarding_completed: true,
  },
  admin: {
    id: 'usr-admin-1',
    email: 'admin@eduverse.ai',
    full_name: 'System Admin',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    role: 'admin',
    plan: 'enterprise',
    onboarding_completed: true,
  }
};

// 6. Leaderboard Users Seed
export const MOCK_LEADERBOARD = [
  { name: 'Alice Dev', xp: 48200, currentStreak: 45, level: 18, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80' },
  { name: 'Alex Math', xp: 41250, currentStreak: 32, level: 16, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' },
  { name: 'Shivam Kumar (You)', xp: 1250, currentStreak: 3, level: 2, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80' },
  { name: 'Sarah Spark', xp: 8200, currentStreak: 12, level: 9, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80' },
  { name: 'Beta Coder', xp: 6400, currentStreak: 8, level: 7, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80' }
];
