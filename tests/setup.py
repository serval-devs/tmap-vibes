import os
import stat
import subprocess
import requests
import zipfile
from pathlib import Path

chrome_url = "https://googlechromelabs.github.io/chrome-for-testing/known-good-versions-with-downloads.json"  # noqa: E501
chrome_version_commands = [
    r"reg query HKEY_CURRENT_USER\Software\Google\Chrome\BLBeacon /v version",
    r"reg query HKEY_CURRENT_USER\Software\Chromium\BLBeacon /v version"
]


def get_installed_chrome_version():
    """
    Get the installed Chrome version from the Windows registry.
    """
    # Query the registry for Chrome version
    try:
        result = subprocess.run(
            chrome_version_commands[0].split(),
            capture_output=True,
            text=True,
            check=True
        )
        # Extract the version from the output
        for line in result.stdout.splitlines():
            if "version" in line:
                return line.split()[-1]

    except subprocess.CalledProcessError:
        pass  # If Chrome is not found, try Chromium

    try:
        result = subprocess.run(
            chrome_version_commands[1].split(),
            capture_output=True,
            text=True,
            check=True
        )
        for line in result.stdout.splitlines():
            if "version" in line:
                return line.split()[-1]

    except subprocess.CalledProcessError:
        pass

    raise Exception("Failed to retrieve Chrome version.")


def download_and_extract_driver(chrome_version, env_path):
    """
    Download the Chrome driver matching the installed Chrome version
    and extract it.
    """
    # Fetch the JSON file containing driver download links
    response = requests.get(chrome_url)
    response.raise_for_status()
    data = response.json()

    # Find the matching version
    for version_info in data.get("versions", []):
        if version_info.get("version") == chrome_version:
            downloads = version_info.get(
                "downloads", {}).get("chromedriver", [])
            for download in downloads:
                if download.get("platform") == "win64":
                    driver_url = download.get("url")
                    break
            else:
                raise Exception(
                    f"No win64 driver found for Chrome version {chrome_version}.")  # noqa: E501
            break
    else:
        raise Exception(
            f"Chrome version {chrome_version} not found in the JSON file.")

    # Define paths
    driver_dir = Path(env_path) / "web-drivers" / \
        "chrome" / chrome_version
    driver_dir.mkdir(parents=True, exist_ok=True)
    zip_path = driver_dir / "chrome-win64.zip"
    extract_path = Path(env_path) / "Scripts"

    # Download the driver
    print(f"Downloading Chrome driver from {driver_url}...")
    with requests.get(driver_url, stream=True) as r:
        r.raise_for_status()
        with open(zip_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)

    # Extract only the driver executable
    print(f"Extracting Chrome driver executable to {extract_path}...")
    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        for file_name in zip_ref.namelist():
            if "chromedriver.exe" in file_name:
                dest_file = extract_path / Path(file_name).name
                with open(dest_file, "wb") as f:
                    f.write(zip_ref.read(file_name))
                # Set executable permissions
                dest_file.chmod(dest_file.stat().st_mode |
                                stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
                print(f"Driver extracted and permissions set: {dest_file}")
                return

    raise Exception(
        "Chrome driver executable not found in the ZIP file.")


def main():
    # Get the virtual environment path
    env_path = os.environ.get("VIRTUAL_ENV")
    if not env_path:
        raise Exception(
            "This script must be run inside a virtual environment.")

    # Get the installed Chrome version
    chrome_version = get_installed_chrome_version()
    print(f"Installed Chrome version: {chrome_version}")

    # Download and extract the driver
    download_and_extract_driver(chrome_version, env_path)


if __name__ == "__main__":
    main()
