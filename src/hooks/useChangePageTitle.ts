import { useEffect } from "react";

const useTitle = (title: string) => {
  useEffect(() => {
    if (document.title === title) return; // تجنب التحديث غير الضروري
    const prevTitle = document.title;
    document.title = title;

    return () => {
      document.title = prevTitle; // استعادة العنوان السابق عند إزالة المكون
    };
  }, [title]);
};

export default useTitle;
