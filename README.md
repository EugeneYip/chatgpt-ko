## GitHub Pages (Actions) deployment checklist

If `Deploy from a branch` works but selecting `GitHub Actions` appears to do nothing, check these in order:

1. **Workflow file exists on the branch you push to**
   - `.github/workflows/deploy.yml` must be committed and pushed.

2. **GitHub Actions source is selected in Pages settings**
   - Repository Settings → Pages → Build and deployment → Source = `GitHub Actions`.

3. **Actions are enabled for the repository**
   - Repository Settings → Actions → General → Allow all actions.

4. **Push a new commit (or run manually)**
   - This workflow triggers on push to any branch and also supports manual `workflow_dispatch`.

5. **Verify permissions if deployment fails**
   - Workflow needs `pages: write` and `id-token: write`.

6. **Custom domain**
   - `public/CNAME` is included as `italy.eugeneyip.org`.

7. **If site still doesn't load**
   - Check Actions logs first, then Pages deployment status, then DNS/CNAME records.
