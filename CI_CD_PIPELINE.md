# GitHub Actions CI/CD Pipeline

This project uses GitHub Actions to automatically test, build, and deploy the CodeBuddy application.

## 🔄 Pipeline Overview

The CI/CD pipeline runs on every push to `main` or `develop` branches and on pull requests.

### Pipeline Jobs

#### 1. **Test Job** (Runs First)

- Spins up PostgreSQL database
- Installs dependencies
- Runs code formatting check
- Runs TypeScript type checking
- Executes all unit tests
- Uploads coverage reports to Codecov

**Status:** Tests must pass before building Docker image

#### 2. **Build Job** (Runs After Tests Pass)

- Builds Docker image using multi-stage build
- Logs into GitHub Container Registry
- Tags image with branch name and commit SHA
- Pushes to `ghcr.io/tanmayjoddar/codebuddy`
- **Only pushes on main branch** (for production)

**Docker Image Naming:**

```
ghcr.io/tanmayjoddar/codebuddy:main
ghcr.io/tanmayjoddar/codebuddy:main-abc123def  (commit SHA)
```

#### 3. **Security Job** (Runs in Parallel)

- Scans code with Trivy vulnerability scanner
- Uploads results to GitHub Code Scanning
- Helps identify security issues

## 🚀 Automatic Triggers

The pipeline automatically runs:

| Trigger           | Pipeline            | Details                                |
| ----------------- | ------------------- | -------------------------------------- |
| Push to `main`    | Full (test → build) | Tests, builds, and pushes Docker image |
| Push to `develop` | Test only           | Tests code, doesn't push image         |
| Pull Request      | Test only           | Validates code before merge            |

## 📊 Local Testing

Before pushing, test locally:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test:coverage

# Run tests in watch mode
npm test:watch

# Run type check
npm run check

# Check formatting
npm run format:check
```

## 🔐 Secrets & Configuration

The pipeline uses GitHub secrets:

| Secret         | Usage                                       | How to Set              |
| -------------- | ------------------------------------------- | ----------------------- |
| `GITHUB_TOKEN` | Authenticate with GitHub Container Registry | Auto-provided by GitHub |

**No manual configuration needed!** GitHub Actions automatically authenticates using `GITHUB_TOKEN`.

## 📈 Viewing Results

### GitHub Actions Dashboard

1. Go to your repository
2. Click **Actions** tab
3. View workflow runs and logs

### Container Registry

Access your Docker images:

```
https://github.com/tanmayjoddar/codebuddy/pkgs/container/codebuddy
```

### Coverage Reports

Coverage reports uploaded to Codecov (if account linked)

## 🛠️ Configuration Files

### `.github/workflows/ci-cd.yml`

Main workflow file containing all pipeline steps.

### `jest.config.js`

Jest testing configuration for all tests.

### `server/__tests__/*`

Test files for backend functionality.

## 📝 Writing Tests

Example test structure:

```typescript
import { describe, it, expect } from "@jest/globals";

describe("Feature Name", () => {
  it("should do something", () => {
    expect(true).toBe(true);
  });
});
```

## ✅ Workflow Status

Check the status badge in README:

```markdown
![CI/CD Pipeline](https://github.com/tanmayjoddar/codebuddy/actions/workflows/ci-cd.yml/badge.svg)
```

## 🐛 Debugging Pipeline Issues

**View logs:**

1. Go to **Actions** tab
2. Click on failed workflow
3. Click on failed job
4. Expand steps to see detailed logs

**Common Issues:**

| Issue                         | Solution                             |
| ----------------------------- | ------------------------------------ |
| Tests fail                    | Fix errors locally with `npm test`   |
| Docker build fails            | Check `Dockerfile` for syntax errors |
| Registry authentication fails | Verify `GITHUB_TOKEN` is available   |
| Database connection errors    | Check PostgreSQL service in workflow |

## 🎯 Best Practices

1. **Write tests before pushing** - Run `npm test` locally first
2. **Keep commits small** - Easier to debug if something breaks
3. **Use meaningful commit messages** - Helps track what changed
4. **Review workflow logs** - Understand what the CI/CD is doing

## 🚀 Deploying to Production

Once Docker image is built:

```bash
# Pull the latest image
docker pull ghcr.io/tanmayjoddar/codebuddy:main

# Or use the specific commit SHA
docker pull ghcr.io/tanmayjoddar/codebuddy:main-abc123def
```

Deploy to your hosting platform (AWS, Azure, DigitalOcean, etc.)
