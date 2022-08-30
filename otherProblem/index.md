### mac 下 pnpm 全局更新报错:

- Run "pnpm setup" to create it automatically, or set the global-bin-dir setting, or the PNPM_HOME env variable. The global bin directory should be in the PATH.

解决: 先执行 `source ~/.zshrc`, 然后再`pnpm add -g pnpm`
