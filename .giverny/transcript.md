<|user|>
how do i check a folder size in linux CLI
<|end|>
<|assistant|>
```
du -sh /path/to/folder
```

- `du` — disk usage
- `-s` — summary (total only, no subdirectories listed)
- `-h` — human-readable sizes (KB, MB, GB)

To see subdirectory sizes too:

```
du -h --max-depth=1 /path/to/folder
```

On macOS, use `-d 1` instead of `--max-depth=1`:

```
du -h -d 1 /path/to/folder
```
<|end|>
