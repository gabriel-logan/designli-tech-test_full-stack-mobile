env "local" {
  url = "postgres://postgres:postgres@localhost:5432/designli?sslmode=disable"
  dev = "docker://postgres/16/dev"

  schema {
    src = "file://schema.sql"
  }
}
