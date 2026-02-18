# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in The Chattala, please report it by:

1. **DO NOT** open a public GitHub issue
2. Email the maintainers at: [security contact information to be added]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fixes (if any)

We will respond to security reports within 48 hours and work with you to understand and resolve the issue.

## Known Vulnerabilities

### Development Dependencies

The project currently has known vulnerabilities in development dependencies that do not affect production deployments:

#### npm Audit Results (as of February 2026)

**15 vulnerabilities total: 1 moderate, 14 high**

These vulnerabilities are in ESLint and related development dependencies:

- **ajv < 8.18.0** (Moderate severity)
  - Issue: ReDoS vulnerability when using `$data` option
  - Advisory: https://github.com/advisories/GHSA-2g4f-4pwh-qvx6
  - Impact: Limited to development environment only
  - Status: Acceptable risk for development dependencies
  - Mitigation: Does not affect production builds or runtime

The vulnerable packages are:
- `ajv` - Used by ESLint
- `@eslint/eslintrc` - Depends on ajv
- `@eslint-community/eslint-utils` - Depends on eslint
- `@typescript-eslint/*` packages - Development tooling dependencies
- `eslint-config-next` - Next.js ESLint configuration

**Risk Assessment**: 
- All vulnerabilities are in development dependencies
- None of these packages are included in production builds
- The vulnerabilities do not affect the security of deployed applications
- Running `npm audit fix --force` would install breaking changes to ESLint

**Action Taken**: 
- Documented for transparency
- Monitoring for updates that resolve these issues without breaking changes
- Will update when stable versions are available

### Production Security Best Practices

When deploying The Chattala to production:

1. **Environment Variables**
   - Never commit `.env` files to version control
   - Use secure environment variable management
   - Rotate secrets regularly

2. **Dependencies**
   - Keep production dependencies up to date
   - Regularly run `npm audit` to check for production vulnerabilities
   - Review and test updates before deploying

3. **Authentication & Authorization**
   - Implement proper authentication for sensitive areas
   - Use secure session management
   - Follow principle of least privilege

4. **Data Protection**
   - Sanitize user inputs
   - Use parameterized queries
   - Implement proper CORS policies

5. **Infrastructure**
   - Use HTTPS in production
   - Implement rate limiting
   - Configure proper security headers
   - Regular security audits

## Security Updates

We will provide security updates as needed. Subscribe to repository notifications to stay informed about security-related releases.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Security Considerations for Deployment

### Network Security
- Ensure proper firewall configurations
- Use VPN or IP whitelisting for admin access
- Implement DDoS protection

### Application Security
- Enable Next.js security features
- Use Content Security Policy (CSP) headers
- Implement CSRF protection

### Monitoring
- Set up security monitoring and alerting
- Log security-relevant events
- Regular security assessments

## Acknowledgments

We thank the security research community for responsible disclosure of vulnerabilities.

---

Last updated: February 18, 2026
