app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.json({ status: "fail", message: "Thiếu username hoặc password" });

  // Hash mật khẩu
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  db.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
    if (result.length > 0)
      return res.json({ status: "fail", message: "Username đã tồn tại!" });

    db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashPassword],
      (err, result) => {
        if (err) return res.json({ status: "error", err });
        res.json({ status: "success", message: "Đăng ký thành công!" });
      }
    );
  });
});

