# Lesson 1: Upload → store → list a document

Goal by the end of this milestone: from the frontend, you can pick a file,
upload it, and see it appear in a list — backed by a real file on disk and a
real row in Postgres.

This is pseudocode, not real code — you write the real implementation
yourself, in the real files, using this as a scaffold. Ask about anything
that doesn't make sense before writing it.

A deliberate simplification for this lesson: we won't use a migration tool
(like Alembic) yet. We'll create the table directly from the model on
startup. Migrations are a real, important concept — but they solve a problem
(evolving a schema that already has production data) you don't have yet.
We'll introduce them properly in a later milestone.

---

## Step 0 — Run Postgres locally with Docker Compose

**Concept:** Docker Compose lets you describe a service (like "a Postgres
database") in a file, then start/stop it with one command. You're not
installing Postgres on your machine directly — it runs inside an isolated
container.

Create `docker-compose.yml` at the repo root:

```
service: db
  image: <official postgres image, pin a version, e.g. postgres:16>
  environment:
    POSTGRES_USER: <pick a dev username>
    POSTGRES_PASSWORD: <pick a dev password>
    POSTGRES_DB: <pick a database name, e.g. requirements_analyzer>
  ports:
    map container's 5432 -> host's 5432
  volumes:
    persist data to a named volume (so data survives `docker compose down`)
```

Then: `docker compose up -d` starts it in the background, `docker compose ps`
confirms it's running, `docker compose down` stops it.

**Check yourself:** can you connect to it with `psql` or a GUI tool (e.g.
TablePlus, DBeaver) using the user/password/db you picked?

---

## Step 1 — Backend: connect to the database

**Concept:** An ORM (Object-Relational Mapper) lets you define a database
table as a Python class, instead of writing raw SQL for every query.
We'll use SQLAlchemy, the standard choice in the FastAPI world.

Add to `backend/requirements.txt`: `sqlalchemy`, `psycopg` (the Postgres
driver).

New file `backend/app/db.py` (pseudocode):

```
DATABASE_URL = read from environment variable, e.g. "postgresql+psycopg://user:pass@localhost:5432/requirements_analyzer"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()  # all models inherit from this

function get_db():
    open a session
    yield it  # FastAPI dependency pattern — hand the session to the route, close it after
```

**Concept — why an environment variable and not a hardcoded string:**
connection details differ between your machine, a teammate's machine, and
production. Hardcoding would mean editing code to run it elsewhere. Add
`DATABASE_URL` to a `backend/.env` (gitignored — check `backend/.gitignore`
already excludes `.env`) and load it with `python-dotenv` (already in your
dependencies).

---

## Step 2 — Backend: define the `Document` model

New file `backend/app/models.py` (pseudocode):

```
class Document(Base):
    __tablename__ = "documents"

    id: primary key, auto-incrementing integer
    filename: string, the original filename the user uploaded
    stored_path: string, where it actually lives on disk (backend/uploads/<something unique>)
    content_type: string, e.g. "application/pdf"
    uploaded_at: timestamp, default = now
```

**Concept — why `filename` and `stored_path` are different columns:** two
people could both upload a file named `spec.pdf`. If you saved it to disk as
literally `uploads/spec.pdf`, the second upload would overwrite the first.
`stored_path` should use something unique (e.g. a generated UUID as the
actual filename on disk), while `filename` remembers what the user called it
so the UI can still show something human-readable.

In `backend/app/main.py`, on startup: call something like
`Base.metadata.create_all(engine)` — this creates the `documents` table if
it doesn't exist yet. (This is the part a migration tool would normally
handle — acceptable simplification for now, per the note at the top.)

---

## Step 3 — Backend: upload endpoint

**Concept:** File uploads from a browser use `multipart/form-data`, not
JSON. FastAPI has a built-in `UploadFile` type for this.

In `backend/app/main.py` (pseudocode):

```
@app.post("/documents")
def upload_document(file: UploadFile, db = Depends(get_db)):
    generate a unique name for the stored file (e.g. uuid4() + original extension)
    full_path = "uploads/" + unique_name

    read file's contents, write them to full_path on disk
    (make sure backend/uploads/ exists — create it if missing)

    create a Document row: filename=file.filename, stored_path=full_path,
        content_type=file.content_type
    save it to the db, commit

    return the created document (id, filename, uploaded_at)
```

**Check yourself:** test this with `curl` before touching the frontend at
all:

```
curl -F "file=@some-test-file.pdf" http://127.0.0.1:8000/documents
```

Then check `backend/uploads/` on disk, and query the `documents` table
directly (`psql` or your GUI tool) to confirm the row is there. Get this
working end-to-end at the API layer before writing any React — it's much
easier to debug one layer at a time.

---

## Step 4 — Backend: list endpoint

Pseudocode:

```
@app.get("/documents")
def list_documents(db = Depends(get_db)):
    query all Document rows, ordered by uploaded_at descending
    return them as a list
```

**Check yourself:** `curl http://127.0.0.1:8000/documents` after uploading a
couple of files — you should get a JSON array back.

---

## Step 5 — Frontend: upload form

**Concept:** an `<input type="file">` gives you a `File` object in the
browser. To send it to FastAPI's `UploadFile`, you wrap it in a
`FormData` object rather than `JSON.stringify`-ing it.

Pseudocode (a new function alongside `getHealth` in `frontend/src/lib/api.ts`):

```
function uploadDocument(file: File):
    formData = new FormData()
    formData.append("file", file)

    fetch(`${API_URL}/documents`, { method: "POST", body: formData })
    # note: do NOT manually set a Content-Type header — the browser sets the
    # correct multipart boundary automatically when you pass FormData
```

In the page/component: a file input + button, calling `uploadDocument` on
submit, then refreshing the list.

---

## Step 6 — Frontend: list view

Pseudocode:

```
function getDocuments():
    fetch(`${API_URL}/documents`)
    return the JSON array

# in the page component:
fetch the list (on load, and again after a successful upload)
render it as e.g. a table: filename, content type, uploaded_at
```

---

## Suggested commit/PR breakdown

Small, reviewable chunks, each its own branch + PR per the project's git
workflow:

1. `docker-compose.yml` + confirm Postgres runs
2. `db.py` + `models.py` + startup table creation (no endpoints yet) —
   verify the table exists via `psql`
3. Upload endpoint, tested with `curl`
4. List endpoint, tested with `curl`
5. Frontend upload form
6. Frontend list view

Working end-to-end at the API layer (steps 1–4) before writing any frontend
code means when something breaks later, you already know the backend half
works — you're only debugging one new layer at a time.
