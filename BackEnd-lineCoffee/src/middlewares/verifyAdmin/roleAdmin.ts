// تعريف نوع الـ User
interface User {
  role: string;
  // ممكن تضيف خصائص تانية هنا لو في بيانات أكتر للمستخدم
}

// Helper function للتحقق إذا كان المستخدم admin
const isAdmin = (user: User): boolean => user.role === 'admin';

// في الـ middleware
export const checkAdmin = (req: any, res: any, next: any): void => {
  const user: User = req.user; // هنا هيبقى عندك الـ role في الـ req.user

  console.log("useradmin", user.role); // هتشوف الـ role في الـ console

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};


