interface Chart {
  data?: {
    datasets?: Array<{
      type?: string;
      label?: string;
      data?: any[];
      [key: string]: any;
    }>;
    [key: string]: any;
  };
  [key: string]: any;
}

declare global {
  interface Window {
    chart?: Chart | null;
    [key: string]: any;
  }
}

export {};
