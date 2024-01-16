FROM mcr.microsoft.com/devcontainers/base:ubuntu

RUN apt-get update \
    && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y dist-upgrade

USER vscode

# Install ASDF
RUN git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.11.3; \
    echo '. $HOME/.asdf/asdf.sh' >> ~/.bashrc; \
    echo '. $HOME/.asdf/completions/asdf.bash' >> ~/.bashrc;

# Install ASDF plugins
RUN asdf plugin add shellcheck https://github.com/luizm/asdf-shellcheck.git;

WORKDIR /workspaces/nhs-fhir-middy-error-handler
ADD .tool-versions /workspaces/nhs-fhir-middy-error-handler/.tool-versions
ADD .tool-versions /home/vscode/.tool-versions

RUN asdf install; \
    asdf direnv setup --shell bash --version 2.32.2;