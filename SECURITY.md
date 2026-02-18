# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it by emailing the maintainers or opening a private security advisory on GitHub.

## Known Issues

### ESLint Dependencies (ajv)

**Status**: Acknowledged  
**Severity**: Moderate  
**Impact**: Development dependencies only

The project currently has a moderate severity vulnerability in `ajv` (version < 8.18.0), which is a transitive dependency of ESLint and eslint-config-next.

**Details**:
- Vulnerability: ReDoS when using `$data` option in ajv
- Advisory: https://github.com/advisories/GHSA-2g4f-4pwh-qvx6
- Affected package: ajv@6.12.6

**Mitigation**:
- This vulnerability only affects development dependencies (ESLint)
- The vulnerability requires specific usage of the `$data` option in JSON schema validation
- This project does not use ajv directly or with the `$data` option
- Running `npm audit fix --force` would downgrade ESLint to v4.1.1, breaking linting functionality

**Action Plan**:
- Monitor for updates to ESLint and eslint-config-next that include ajv 8.18.0+
- Re-run `npm audit` and `npm update` regularly
- The issue will be resolved when upstream dependencies update their ajv version

## Best Practices

1. Keep dependencies up to date with `npm update`
2. Run `npm audit` regularly to check for new vulnerabilities
3. Review security advisories for all direct dependencies
4. Use environment variables for sensitive data (never commit secrets)
5. Follow the principle of least privilege for API keys and database access
