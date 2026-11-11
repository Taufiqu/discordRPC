# Contributing to YouTube Music Discord RPC

Thank you for considering contributing to YouTube Music Discord RPC! We welcome community contributions, bug reports, and feature requests.

## How Can I Contribute?

### Reporting Bugs
Before submitting an issue, please check if the issue has already been reported. When creating a bug report, please provide:
- Your operating system (Linux / Windows)
- Your browser and its version (Firefox / Chrome / Brave / Edge)
- Your Discord version (Desktop app)
- Steps to reproduce the issue
- Relevant logs from:
  - Extension background page console (`chrome://extensions` or `about:debugging`)
  - `host/debug.log` (if enabled)

### Suggesting Enhancements
Feature requests are always welcome! Open an issue with:
- A clear and descriptive title
- A detailed explanation of the proposed feature
- Potential use cases and why it would be beneficial

### Submitting Pull Requests
1. **Fork** the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/my-new-feature
   ```
2. **Make your changes**:
   - Keep code style consistent with the existing codebase.
   - Test changes locally across supported browsers if possible.
   - Ensure the native host bridge connects and disconnects cleanly.
3. **Commit** with descriptive commit messages (following [Conventional Commits](https://www.conventionalcommits.org/)):
   ```bash
   git commit -m "feat: add support for album art fallback cache"
   ```
4. **Push** to your fork and submit a Pull Request against the `main` branch.

## Codebase Architecture
- `extension/`: Browser extension built on Manifest V3. Communicates with YouTube Music DOM (`content/`) and manages Native Messaging lifecycle (`background/`).
- `host/`: Local Node.js application that bridges extension stdio messages with Discord's local IPC socket (`@xhayper/discord-rpc`).
- `package_extension.py`: Helper script to package `.zip` files for submission and distribution.

## License
By contributing to this project, you agree that your contributions will be licensed under the [MIT License](LICENSE).
