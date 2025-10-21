FROM mcr.microsoft.com/devcontainers/base:ubuntu

ARG TARGETARCH
ENV TARGETARCH=${TARGETARCH}

ARG ASDF_VERSION
COPY .tool-versions.asdf /tmp/.tool-versions.asdf

# System updates
RUN apt-get update \
    && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y dist-upgrade \
    && apt-get -y install --no-install-recommends \
    git make

# Python dependencies
RUN apt-get -y install --no-install-recommends \
    libffi-dev libsqlite3-dev

# Install ASDF
RUN ASDF_VERSION=$(awk '!/^#/ && NF {print $1; exit}' /tmp/.tool-versions.asdf) && \
    wget -O /tmp/asdf.tar.gz https://github.com/asdf-vm/asdf/releases/download/v${ASDF_VERSION}/asdf-v${ASDF_VERSION}-linux-amd64.tar.gz; \
    tar -xvzf /tmp/asdf.tar.gz; \
    mv asdf /usr/bin

USER vscode

ENV PATH="$PATH:/home/vscode/.asdf/shims/:/home/vscode/.asdf/bin/:/workspaces/nhs-fhir-middy-error-handler/node_modules/.bin:$PATH"
RUN \
    echo 'PATH="/home/vscode/.asdf/shims/:$PATH"' >> ~/.bashrc; \
    echo '. <(asdf completion bash)' >> ~/.bashrc; \
    echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc; \
    echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc; \
    echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc;

# Install ASDF plugins
RUN asdf plugin add python; \
    asdf plugin add poetry https://github.com/asdf-community/asdf-poetry.git; \
    asdf plugin add shellcheck https://github.com/luizm/asdf-shellcheck.git; \
    asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git; \
    asdf plugin-add direnv; \
    asdf plugin add actionlint;

WORKDIR /workspaces/nhs-fhir-middy-error-handler
ADD .tool-versions /workspaces/nhs-fhir-middy-error-handler/.tool-versions
ADD .tool-versions /home/vscode/.tool-versions

RUN asdf install python; \
    asdf install
