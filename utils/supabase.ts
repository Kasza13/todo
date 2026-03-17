const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@email.com",
  password: "password123",
});
