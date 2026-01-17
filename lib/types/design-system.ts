
export interface DesignConfig {
  global: {
    backgroundColor: string;
    backgroundImageUrl?: string;
    font: string;
  };
  header: {
    title: {
      text: string;
      color: string;
      size: string; // e.g., '2xl', '3xl'
    };
    subtitle: {
      text: string;
      color: string;
    };
    bio: {
      text: string;
      color: string;
    };
    avatar: {
      show: boolean;
      shape: 'circle' | 'square' | 'rounded';
    };
  };
  cards: {
    globalDefaults: {
      aspectRatio: 'square' | 'vertical' | 'video'; // 'square' | '3/4' | '16/9'
      bgColor: string;
      style: 'minimal' | 'border' | 'shadow';
    };
    overrides?: Record<string, {
      aspectRatio?: 'square' | 'vertical' | 'video';
      bgColor?: string;
    }>;
  };
}

export const DEFAULT_DESIGN_CONFIG: DesignConfig = {
  global: {
    backgroundColor: "#ffffff",
    font: "Inter, sans-serif",
  },
  header: {
    title: {
      text: "Colección",
      color: "#000000",
      size: "3xl"
    },
    subtitle: {
      text: "Nuevos lanzamientos disponibles",
      color: "#666666"
    },
    bio: {
      text: "",
      color: "#666666"
    },
    avatar: {
      show: true,
      shape: "circle"
    }
  },
  cards: {
    globalDefaults: {
      aspectRatio: "square",
      bgColor: "#ffffff",
      style: "minimal"
    }
  }
};
